# Search Log Time-Series Aggregation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement time-series query aggregation for search logs using Redis, NestJS Schedule, and BullMQ, flush statistics every 30 minutes, and Bulk Upsert them into the database using Drizzle ORM.

**Architecture:** 
1. `BooksService` intercepts searches and increments search query frequency counts in a Redis Hash (`search:logs:daily:[date]`), storing active dates in a Redis Set (`search:logs:dates`).
2. A BullMQ worker (`SearchLogProcessor`) runs periodically (triggered by a BullMQ Job Scheduler every 30 minutes).
3. The processor atomically renames Redis Keys to prevent race conditions, pops active dates, parses the stats, and performs a Bulk Upsert into PostgreSQL via Drizzle ORM.

**Tech Stack:** NestJS, BullMQ, Redis (ioredis), PostgreSQL (Drizzle ORM)

---

### Task 1: Drizzle Database Schema and Migration

**Files:**
- Create: `apps/api/src/database/schema/searchLogs.spec.ts`
- Modify: `apps/api/src/database/schema/searchLogs.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/api/src/database/schema/searchLogs.spec.ts` and write a unit test to verify the existence of the new `searchDate` and `count` columns.

```typescript
// apps/api/src/database/schema/searchLogs.spec.ts
import { searchLogs } from "./searchLogs";

describe("searchLogs 스키마 정의 테스트", () => {
  it("searchDate와 count 컬럼이 존재해야 한다", () => {
    expect(searchLogs.searchDate).toBeDefined();
    expect(searchLogs.count).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- apps/api/src/database/schema/searchLogs.spec.ts`
Expected: FAIL (Cannot find modules or compilation error because schema doesn't have `searchDate` and `count` yet).

- [ ] **Step 3: Write minimal implementation**

Modify `apps/api/src/database/schema/searchLogs.ts` to update the table structure to include `searchDate` and `count` with the composite unique constraint.

```typescript
// apps/api/src/database/schema/searchLogs.ts
import { pgTable, pgEnum, text, integer, date, unique } from "drizzle-orm/pg-core"

export const searchMode = pgEnum("mode", ["isbn", "title"])

export const searchLogs = pgTable("searchLogs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mode: searchMode(),
  query: text("query").notNull(),
  searchDate: date("search_date").defaultNow().notNull(), // 생성 시간 대신 일별 집계 검색 발생 날짜
  count: integer("search_count").default(1).notNull(), // 검색 횟수 컬럼 추가
}, (table) => [
  // 복합 유니크 제약 설정: 동일 날짜 + 동일 검색어 + 동일 모드의 중복 저장을 막고 Upsert의 기준 키가 됨
  unique("search_logs_date_query_mode_unique").on(table.searchDate, table.query, table.mode)
])
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- apps/api/src/database/schema/searchLogs.spec.ts`
Expected: PASS

- [ ] **Step 5: Run Drizzle Kit to generate and push development migration**

Generate the migration files:
Run: `npm run db:generate-dev`

Push/Apply database updates to local database:
Run: `npm run db:push-dev`
Expected: Database schema successfully updated.

- [ ] **Step 6: Commit**

```powershell
git add apps/api/src/database/schema/searchLogs.ts apps/api/src/database/schema/searchLogs.spec.ts
git commit -m "feat: 검색 로그 테이블 스키마에 일자별 집계용 컬럼 및 유니크 제약조건 추가"
```

---

### Task 2: Redis Search Logging Implementation in BooksService

**Files:**
- Modify: `apps/api/src/constant/tokens.ts`
- Modify: `apps/api/src/books/books.service.ts`
- Modify: `apps/api/src/books/books.service.spec.ts`

- [ ] **Step 1: Write the failing test**

Modify `apps/api/src/books/books.service.spec.ts` to assert that searching books calls a tracking helper `_trackSearch` which calls `redis.hincrby` and `redis.sadd`.

First, let's examine the test file to see how redis is mocked. If not mocked, inject a mocked Redis client. Add these test cases to `apps/api/src/books/books.service.spec.ts`:

```typescript
// Add inside the existing describe("BooksService", () => { ... })
it("searchBooks 호출 시 _trackSearch 가 정상 호출되고 Redis 해시 및 셋에 값이 추가되어야 한다", async () => {
  const hincrbySpy = jest.spyOn(mockRedis, "hincrby").mockResolvedValue(1);
  const saddSpy = jest.spyOn(mockRedis, "sadd").mockResolvedValue(1);

  await service.searchBooks("title", "nestjs", 1);

  expect(hincrbySpy).toHaveBeenCalled();
  expect(saddSpy).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- apps/api/src/books/books.service.spec.ts`
Expected: FAIL (Cannot read property hincrby of undefined OR helper not implemented yet).

- [ ] **Step 3: Write minimal implementation**

First, expand constant tokens in `apps/api/src/constant/tokens.ts`:

```typescript
// apps/api/src/constant/tokens.ts
export const REDIS_CLIENT = "REDIS_CLIENT" as const

export const QUEUE_NAMES = {
  POPULARITY: "popularity",
  SEARCH_LOG: "search-log", // 신규 추가할 검색 로그 배치 큐
} as const

export const REDIS_KEYS = {
  POPULARITY_COUNT: "popularity:count",
  POPULARITY_META: "popularity:meta",
  POPULARITY_COUNT_PROCESSING: "popularity:count:processing",
  POPULARITY_META_PROCESSING: "popularity:meta:processing",
  
  // 신규 검색 로그용 키
  SEARCH_LOG_DATES: "search:logs:dates", // 활성 날짜들이 담기는 Set
  SEARCH_LOG_DAILY_PREFIX: "search:logs:daily:", // 일자별 해시 키의 접두사
}
```

Next, modify `apps/api/src/books/books.service.ts` to implement `_trackSearch` and invoke it inside `searchBooks`:

```typescript
// apps/api/src/books/books.service.ts
// Add constant imports if needed:
import { REDIS_KEYS } from 'src/constant/tokens';

// Inside BooksService class, modify searchBooks method:
  @Serialize(BookDto)
  async searchBooks(
    mode: searchBooksDto['mode'],
    query: searchBooksDto['query'],
    pageNo: searchBooksDto['pageNo'] = 1,
  ) {
    this.logger.log(
      `도서 목록 검색 시작: mode=${mode}, query=${query}, pageNo=${pageNo}`,
    );

    // 검색 추적 비동기 호출 (메인 비즈니스 흐름 응답 지연 없도록 .catch 처리)
    this._trackSearch(mode, query).catch((error) => {
      this.logger.error(`검색 로그 로깅 실패: mode=${mode}, query=${query}`, error);
    });

    let params;
    if (mode === 'title') {
      params = {
        title: query,
      };
    } else if (mode === 'isbn') {
      params = {
        isbn13: query,
      };
    }
    // ... (기존 코드 유지)
```

And implement `_trackSearch` method inside `BooksService` class:

```typescript
// Add at the bottom of BooksService class:
  async _trackSearch(mode: 'isbn' | 'title', query: string): Promise<void> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // 한국 시간 기준 YYYY-MM-DD 날짜 추출
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    const dailyHashKey = `${REDIS_KEYS.SEARCH_LOG_DAILY_PREFIX}${today}`;
    const field = `${mode}:${trimmedQuery}`;

    try {
      const pipeline = this.redis.pipeline();
      pipeline.hincrby(dailyHashKey, field, 1);
      pipeline.sadd(REDIS_KEYS.SEARCH_LOG_DATES, today);
      await pipeline.exec();
      this.logger.log(`검색 로그 임시 저장 성공 (Redis): ${field} (${today})`);
    } catch (error) {
      this.logger.error(`Redis 검색 로그 저장 중 오류 발생: ${field}`, error);
    }
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- apps/api/src/books/books.service.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add apps/api/src/constant/tokens.ts apps/api/src/books/books.service.ts apps/api/src/books/books.service.spec.ts
git commit -m "feat: BooksService 검색 시 Redis에 실시간 검색 횟수 카운트를 원자적으로 저장하는 기능 추가"
```

---

### Task 3: SearchLogProcessor (BullMQ Worker)

**Files:**
- Create: `apps/api/src/task/processor/search-log.processor.ts`
- Create: `apps/api/src/task/processor/search-log.processor.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/api/src/task/processor/search-log.processor.spec.ts` to mock database and Redis dependencies and verify that executing the processor parses Redis hashes correctly and runs bulk upserts.

```typescript
// apps/api/src/task/processor/search-log.processor.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { SearchLogProcessor } from "./search-log.processor";
import { REDIS_CLIENT, DATABASE_CONNECTION } from "src/constant/tokens";

describe("SearchLogProcessor 테스트", () => {
  let processor: SearchLogProcessor;
  let mockRedis: any;
  let mockDb: any;
  let originalEnv: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production"; // 개발 우회 방지용
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  beforeEach(async () => {
    mockRedis = {
      smembers: jest.fn().mockResolvedValue(["2026-05-31"]),
      rename: jest.fn().mockResolvedValue("OK"),
      srem: jest.fn().mockResolvedValue(1),
      hgetall: jest.fn().mockResolvedValue({ "title:nestjs": "5", "isbn:123456": "2" }),
      del: jest.fn().mockResolvedValue(1),
    };

    mockDb = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      onConflictDoUpdate: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchLogProcessor,
        { provide: REDIS_CLIENT, useValue: mockRedis },
        { provide: DATABASE_CONNECTION, useValue: mockDb },
      ],
    }).compile();

    processor = module.get<SearchLogProcessor>(SearchLogProcessor);
  });

  it("정상적으로 배치 작업이 실행되어 Redis 데이터를 DB에 Bulk Upsert 해야 한다", async () => {
    const job = { name: "flush-search-logs", data: {} } as any;
    await processor.process(job);

    expect(mockRedis.smembers).toHaveBeenCalled();
    expect(mockRedis.rename).toHaveBeenCalled();
    expect(mockRedis.srem).toHaveBeenCalled();
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockRedis.del).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- apps/api/src/task/processor/search-log.processor.spec.ts`
Expected: FAIL (Processor is not defined).

- [ ] **Step 3: Write minimal implementation**

Create `apps/api/src/task/processor/search-log.processor.ts` to implement the BullMQ Worker logic:

```typescript
// apps/api/src/task/processor/search-log.processor.ts
import { Processor, WorkerHost } from "@nestjs/bullmq"
import { Inject, Logger } from "@nestjs/common"
import { Job } from "bullmq"
import { NodePgDatabase } from "drizzle-orm/node-postgres"
import { sql } from "drizzle-orm"
import Redis from "ioredis"
import { QUEUE_NAMES, REDIS_CLIENT, REDIS_KEYS } from "src/constant/tokens"
import { DATABASE_CONNECTION } from "src/database/database.provider"
import * as schema from "src/database/schema"

@Processor(QUEUE_NAMES.SEARCH_LOG)
export class SearchLogProcessor extends WorkerHost {
  private readonly logger = new Logger(SearchLogProcessor.name)

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>
  ) {
    super()
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (process.env.NODE_ENV === "development") {
      this.logger.debug(
        "search-log processor: running in development mode, skipping processing"
      )
      return
    }

    this.logger.log("검색 로그 DB 이관 배치 작업 시작...")

    // 1. 활성 검색 날짜 목록 가져오기
    const dates = await this.redis.smembers(REDIS_KEYS.SEARCH_LOG_DATES)
    if (dates.length === 0) {
      this.logger.log("이관할 검색 로그 대상 날짜가 없습니다.")
      return
    }

    for (const searchDate of dates) {
      const dailyKey = `${REDIS_KEYS.SEARCH_LOG_DAILY_PREFIX}${searchDate}`
      const processingKey = `${dailyKey}:processing`

      // 2. 키 존재 여부 확인
      const keyExists = await this.redis.exists(dailyKey)
      if (!keyExists) {
        // 이미 유실된 날짜일 경우 대기열 목록에서 제거
        await this.redis.srem(REDIS_KEYS.SEARCH_LOG_DATES, searchDate)
        continue
      }

      // 3. Race condition 격리를 위한 Rename 실행
      try {
        await this.redis.rename(dailyKey, processingKey)
        await this.redis.srem(REDIS_KEYS.SEARCH_LOG_DATES, searchDate)
      } catch (error: any) {
        if (error.message?.includes("ERR no such key")) {
          continue
        }
        this.logger.warn(`Redis 격리 키 이름 변경 실패: ${dailyKey}`, error)
        continue
      }

      // 4. 격리된 해시에서 전량 읽기
      const dailyData = await this.redis.hgetall(processingKey)
      const fields = Object.keys(dailyData)
      if (fields.length === 0) {
        await this.redis.del(processingKey)
        continue
      }

      // 5. DB insert용 레코드 목록 파싱
      const records: Array<{
        mode: "isbn" | "title"
        query: string
        searchDate: string
        count: number
      }> = []

      for (const field of fields) {
        const separatorIndex = field.indexOf(":")
        if (separatorIndex === -1) continue

        const mode = field.slice(0, separatorIndex) as "isbn" | "title"
        const query = field.slice(separatorIndex + 1)
        const count = Number(dailyData[field]) || 0

        if (!query || count <= 0) continue

        records.push({
          mode,
          query,
          searchDate,
          count,
        })
      }

      if (records.length === 0) {
        await this.redis.del(processingKey)
        continue
      }

      // 6. DB Bulk Upsert 실행
      try {
        await this.db
          .insert(schema.searchLogs)
          .values(records)
          .onConflictDoUpdate({
            target: [schema.searchLogs.searchDate, schema.searchLogs.query, schema.searchLogs.mode],
            set: {
              count: sql`${schema.searchLogs.count} + excluded.count`,
            },
          })

        this.logger.log(`[${searchDate}] ${records.length}건의 검색 로그 누적 집계 DB 이관 완료.`)
        
        // 7. 이관 성공 시 격리 키 제거
        await this.redis.del(processingKey)
      } catch (dbError) {
        this.logger.error(`[${searchDate}] DB 이관 처리 중 오류 발생`, dbError)
        // 실패 시 에러를 던져 BullMQ가 Job을 실패처리하고 재시도할 수 있도록 지원
        throw dbError
      }
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- apps/api/src/task/processor/search-log.processor.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add apps/api/src/task/processor/search-log.processor.ts apps/api/src/task/processor/search-log.processor.spec.ts
git commit -m "feat: Redis 격리 저장 데이터를 PostgreSQL로 원자적으로 Bulk Upsert하는 BullMQ Processor 구현"
```

---

### Task 4: SearchLogTaskService & TaskModule Registration

**Files:**
- Create: `apps/api/src/task/SearchLogTask.service.ts`
- Create: `apps/api/src/task/SearchLogTask.service.spec.ts`
- Modify: `apps/api/src/task/task.module.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/api/src/task/SearchLogTask.service.spec.ts` to assert that scheduling of the queue flush is registered during module initialisation.

```typescript
// apps/api/src/task/SearchLogTask.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { SearchLogTaskService } from "./SearchLogTask.service";
import { getQueueToken } from "@nestjs/bullmq";
import { QUEUE_NAMES } from "src/constant/tokens";

describe("SearchLogTaskService 테스트", () => {
  let service: SearchLogTaskService;
  let mockQueue: any;

  beforeEach(async () => {
    mockQueue = {
      setGlobalConcurrency: jest.fn().mockResolvedValue({}),
      upsertJobScheduler: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchLogTaskService,
        { provide: getQueueToken(QUEUE_NAMES.SEARCH_LOG), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<SearchLogTaskService>(SearchLogTaskService);
  });

  it("정의되어 있어야 한다", () => {
    expect(service).toBeDefined();
  });

  it("모듈 초기화 시 대기열 동시성과 30분 주기 작업 스케줄러가 등록되어야 한다", async () => {
    await service.onModuleInit();
    expect(mockQueue.setGlobalConcurrency).toHaveBeenCalledWith(1);
    expect(mockQueue.upsertJobScheduler).toHaveBeenCalledWith(
      "flush-search-logs-job",
      expect.objectContaining({ pattern: "*/30 * * * *" }) // EVERY_30_MINUTES
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- apps/api/src/task/SearchLogTask.service.spec.ts`
Expected: FAIL (Service is not defined).

- [ ] **Step 3: Write minimal implementation**

Create `apps/api/src/task/SearchLogTask.service.ts`:

```typescript
// apps/api/src/task/SearchLogTask.service.ts
import { Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { CronExpression } from "@nestjs/schedule"
import { InjectQueue } from "@nestjs/bullmq"
import { QUEUE_NAMES } from "src/constant/tokens"
import { Queue } from "bullmq"

@Injectable()
export class SearchLogTaskService implements OnModuleInit {
  private readonly logger = new Logger(SearchLogTaskService.name)
  constructor(@InjectQueue(QUEUE_NAMES.SEARCH_LOG) private searchLogQueue: Queue) {}

  async onModuleInit() {
    // 동시 실행을 방지하기 위해 글로벌 동시성 1 설정
    await this.searchLogQueue.setGlobalConcurrency(1)
    await this.enqueueSearchLogFlush().catch((error) => {
      this.logger.error(
        "Failed to enqueue search log flush job on module init",
        error
      )
    })
  }

  async enqueueSearchLogFlush() {
    if (process.env.NODE_ENV === "development") {
      this.logger.warn("개발 환경에서는 검색 로그 이관 작업을 건너뜁니다.")
      return
    }
    this.logger.log("검색 로그 이관 스케줄러 등록 시작...")
    await this.searchLogQueue.upsertJobScheduler("flush-search-logs-job", {
      pattern: CronExpression.EVERY_30_MINUTES,
    })
    this.logger.log("검색 로그 이관 스케줄러 등록 완료 (30분 주기)")
  }
}
```

Next, modify `apps/api/src/task/task.module.ts` to register the new queue, processor, and service:

```typescript
// apps/api/src/task/task.module.ts
import { Module } from "@nestjs/common"

import { TaskController } from "./task.controller"
import { BooksModule } from "src/books/books.module"
import { MeilisearchModule } from "src/meilisearch/meilisearch.module"
import { CommonModule } from "src/common/common.module"
import { MeiliSearchTaskService } from "./MeiliSearchTask.service"
import { GovLibraryBigDataTaskService } from "./GovLibraryBigdataTask.service"
import { LibrariesModule } from "src/libraries/libraries.module"
import { TrackingTaskService } from "./TrackingTask.service"
import { PopularityProcessor } from "./processor/popularity.processor"
import { QUEUE_NAMES } from "src/constant/tokens"
import { BullModule } from "@nestjs/bullmq"

// 신규 추가 임포트
import { SearchLogTaskService } from "./SearchLogTask.service"
import { SearchLogProcessor } from "./processor/search-log.processor"

@Module({
  controllers: [TaskController],
  providers: [
    MeiliSearchTaskService,
    GovLibraryBigDataTaskService,
    TrackingTaskService,
    PopularityProcessor,
    SearchLogTaskService,   // 신규 등록
    SearchLogProcessor,     // 신규 등록
  ],
  imports: [
    BooksModule,
    MeilisearchModule,
    CommonModule,
    LibrariesModule,
    BullModule.registerQueue(
      {
        name: QUEUE_NAMES.POPULARITY,
      },
      {
        name: QUEUE_NAMES.SEARCH_LOG, // 신규 큐 등록
      }
    ),
  ],
})
export class TaskModule {}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- apps/api/src/task/SearchLogTask.service.spec.ts`
Expected: PASS

Verify all tests pass in the workspace:
Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add apps/api/src/task/SearchLogTask.service.ts apps/api/src/task/SearchLogTask.service.spec.ts apps/api/src/task/task.module.ts
git commit -m "feat: SearchLogTaskService 스케줄러 등록 및 TaskModule에 BullMQ 큐 바인딩 완료"
```
