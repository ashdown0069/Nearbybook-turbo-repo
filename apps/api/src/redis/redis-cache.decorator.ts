import { createDecorator } from "@toss/nestjs-aop"

export const REDIS_CACHE_DECORATOR = Symbol("REDIS_CACHE_DECORATOR")

export interface RedisCacheOptions {
  /**
   * 캐시 유효 시간. 단위: **초(s)**. 기본값 3600(1시간).
   *
   * ioredis 의 `SET ... EX` 로 저장하므로 초 단위다.
   * 컨트롤러의 @CacheTTL(밀리초)과 단위가 다르니 값을 옮겨 쓰지 않는다.
   * 상수는 src/constant/cache-ttl.ts 의 REDIS_CACHE_TTL 을 사용한다.
   */
  ttlSeconds?: number
}

export const RedisCache = (options?: RedisCacheOptions) =>
  createDecorator(REDIS_CACHE_DECORATOR, options ?? {})
