import { Inject, Injectable, Logger } from "@nestjs/common"
import Redis from "ioredis"
import { randomUUID } from "crypto"
import { REDIS_CLIENT } from "src/constant/tokens"

@Injectable()
export class DistributedLockService {
  private readonly logger = new Logger(DistributedLockService.name)

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /**
   * 락 획득 시도
   *
   * Redis SET NX EX 명령의 원자성을 이용하여
   * 동시에 여러 인스턴스가 호출해도 단 하나만 성공한다.
   * 호출 시마다 고유 실행 토큰을 발급하여 소유권을 격리한다.
   *
   * @param key - 락 식별 키 (예: 'cron:bookScraper')
   * @param ttlSeconds - 락 자동 만료 시간(초). 인스턴스 크래시 시 안전장치 역할
   * @returns 락 획득 성공 시 고유 실행 토큰(String), 이미 다른 인스턴스가 점유 중이면 null 반환
   */
  async tryAcquire(key: string, ttlSeconds: number): Promise<string | null> {
    const lockKey = `lock:${key}`
    const executionToken = randomUUID() // 매 호출마다 고유 실행 토큰 생성

    // SET key value NX EX ttl → 키가 없을 때만 설정하는 원자적 명령
    const result = await this.redis.set(
      lockKey,
      executionToken,
      "EX",
      ttlSeconds,
      "NX"
    )
    const acquired = result === "OK"

    if (acquired) {
      this.logger.log(
        `분산 락 획득 성공: ${lockKey} (실행 토큰: ${executionToken})`
      )
      return executionToken
    } else {
      this.logger.warn(`분산 락 획득 거부: ${lockKey} (다른 인스턴스에서 점유 중)`)
      return null
    }
  }

  /**
   * 락 해제
   *
   * Lua 스크립트로 "자기 것인지 확인 → 삭제"를 원자적으로 수행한다.
   * 전달받은 고유 실행 토큰을 검증함으로써 소유권 격리 누수 문제를 차단한다.
   *
   * @param key - 해제할 락의 키
   * @param token - 락 획득 시 발급받았던 고유 실행 토큰
   * @returns true면 정상 해제, false면 소유권 불일치(이미 만료되었거나 다른 인스턴스 소유)
   */
  async release(key: string, token: string): Promise<boolean> {
    const lockKey = `lock:${key}`

    // Lua 스크립트: KEYS[1]의 값이 ARGV[1](자신의 executionToken)과 일치하면 DEL
    const script = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      else
        return 0
      end
    `

    const result = await this.redis.eval(script, 1, lockKey, token)
    const released = result === 1

    if (released) {
      this.logger.log(`분산 락 해제 완료: ${lockKey}`)
    } else {
      this.logger.warn(
        `분산 락 해제 실패: ${lockKey} (소유권이 없거나 이미 해제됨)`
      )
    }

    return released
  }
}

