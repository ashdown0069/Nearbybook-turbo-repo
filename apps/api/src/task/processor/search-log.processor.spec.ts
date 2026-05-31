import { Test, TestingModule } from "@nestjs/testing";
import { SearchLogProcessor } from "./search-log.processor";
import { REDIS_CLIENT } from "src/constant/tokens";
import { DATABASE_CONNECTION } from "src/database/database.provider";

describe("SearchLogProcessor 테스트", () => {
  let processor: SearchLogProcessor;
  let mockRedis: any;
  let mockDb: any;
  let originalEnv: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production"; // 개발 환경 우회 방지용 설정
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  beforeEach(async () => {
    // Redis 모킹: 키 격리, 해시 조회, 키 삭제, 조회 등의 로직 수행 검증용
    mockRedis = {
      smembers: jest.fn().mockResolvedValue(["2026-05-31"]),
      rename: jest.fn().mockResolvedValue("OK"),
      srem: jest.fn().mockResolvedValue(1),
      hgetall: jest.fn().mockResolvedValue({ "title:nestjs": "5", "isbn:123456": "2" }),
      del: jest.fn().mockResolvedValue(1),
      exists: jest.fn().mockResolvedValue(1),
    };

    // DB (Drizzle ORM) 모킹: Bulk Upsert 로직 검증용
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
