import { Inject, Injectable, Logger, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import Redis from "ioredis"
import { REDIS_CLIENT, REDIS_KEYS } from "src/constant/tokens"

@Injectable()
export class SearchLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SearchLogMiddleware.name)

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { query, mode } = req.query

    if (query && (mode === "isbn" || mode === "title")) {
      const trimmedQuery = String(query).trim()
      const searchMode = String(mode) as "isbn" | "title"

      if (trimmedQuery) {
        // 한국 시간 기준 YYYY-MM-DD 날짜 추출
        const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" })
        const dailyHashKey = `${REDIS_KEYS.SEARCH_LOG_DAILY_PREFIX}${today}`
        const field = `${searchMode}:${trimmedQuery}`

        try {
          const pipeline = this.redis.pipeline()
          pipeline.hincrby(dailyHashKey, field, 1)
          pipeline.sadd(REDIS_KEYS.SEARCH_LOG_DATES, today)
          await pipeline.exec()
        } catch (error) {
          // 비동기 로깅 실패 시 사용자 검색 흐름을 방해하지 않고 에러 로그만 남김
          this.logger.error(`Redis 검색 로그 저장 실패: ${field}`, error instanceof Error ? error.stack : undefined)
        }
      }
    }
    next()
  }
}
