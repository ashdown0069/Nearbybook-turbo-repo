/**
 * 캐시 TTL 상수.
 *
 * ⚠️ 이 파일에는 시간 단위가 서로 다른 두 상수 객체가 있다. 절대 섞어 쓰지 않는다.
 *
 * - HTTP_CACHE_TTL  → @CacheTTL / CacheModule 용. **밀리초**
 * - REDIS_CACHE_TTL → @RedisCache 용. **초**
 */

/**
 * HTTP 응답 캐시(@CacheTTL, CacheModule)용 TTL. 단위: **밀리초(ms)**.
 *
 * @nestjs/cache-manager v3 는 이 값을 cache-manager v7 → keyv 로 그대로 넘기며,
 * keyv 의 set(key, value, ttl) 은 ttl 을 밀리초로 해석한다.
 * app.module.ts 의 CacheModule 기본값(30 * 60 * 1000)과 같은 단위다.
 */
export const HTTP_CACHE_TTL = {
  /** 24시간 */
  ONE_DAY: 24 * 60 * 60 * 1000,
  /** 30분 */
  THIRTY_MINUTES: 30 * 60 * 1000,
} as const

/**
 * 서비스 메서드 캐시(@RedisCache)용 TTL. 단위: **초(s)**.
 *
 * RedisCacheAspect 가 ioredis 의 `SET key value EX <seconds>` 로 저장하므로 초 단위다.
 * 위 HTTP_CACHE_TTL 과 단위가 1000배 다르니 값을 복사해 쓰지 않는다.
 */
export const REDIS_CACHE_TTL = {
  /** 24시간 */
  ONE_DAY: 24 * 60 * 60,
} as const
