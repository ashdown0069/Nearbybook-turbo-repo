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

  /**
   * BullMQ Worker 진입점 메서드
   * Redis에서 수집된 검색 로그 데이터를 DB(PostgreSQL)로 이관(Bulk Upsert)하는 원자적 배치 흐름
   * @param job BullMQ 작업 객체
   */
  async process(job: Job<any, any, string>): Promise<any> {
    if (process.env.NODE_ENV === "development") {
      this.logger.debug(
        "search-log processor: running in development mode, skipping processing"
      )
      return
    }

    this.logger.log("검색 로그 DB 이관 배치 작업 시작...")

    // 1. 활성 검색 날짜 목록 가져오기 (Redis Set 조회)
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
        // 이미 유실되거나 처리된 날짜일 경우 활성 날짜 Set 대기열 목록에서 제거
        await this.redis.srem(REDIS_KEYS.SEARCH_LOG_DATES, searchDate)
        continue
      }

      // 3. Race condition 격리를 위한 Rename 실행 (원자적 상태 격리)
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

      // 6. DB Bulk Upsert 실행 (Drizzle ORM 활용)
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
        
        // 7. 이관 성공 시 격리 백업 키 제거
        await this.redis.del(processingKey)
      } catch (dbError) {
        this.logger.error(`[${searchDate}] DB 이관 처리 중 오류 발생`, dbError)
        // 실패 시 에러를 던져 BullMQ가 Job을 실패처리하고 재시도할 수 있도록 지원
        throw dbError
      }
    }
  }
}
