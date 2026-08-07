import { HTTP_CACHE_TTL, REDIS_CACHE_TTL } from "./cache-ttl";

// ==========================================================
// [용어 설명 주석]
// 1. TTL (Time To Live): 캐시에 저장된 값이 자동으로 만료되기까지의 유효 시간입니다.
// 2. 이 프로젝트에는 시간 단위가 다른 캐시 계층이 두 개 있습니다.
//    - HTTP 응답 캐시(@CacheTTL) → cache-manager v7 / keyv 는 밀리초로 해석
//    - 서비스 메서드 캐시(@RedisCache) → ioredis 의 SET ... EX 는 초로 해석
//    두 상수를 헷갈려 쓰면 캐시 시간이 1000배 어긋나므로 아래 테스트로 못을 박습니다.
// ==========================================================

describe("캐시 TTL 상수", () => {
  it("HTTP_CACHE_TTL 은 밀리초 단위여야 한다", () => {
    // 24시간 = 86,400,000ms / 30분 = 1,800,000ms
    expect(HTTP_CACHE_TTL.ONE_DAY).toBe(86_400_000);
    expect(HTTP_CACHE_TTL.THIRTY_MINUTES).toBe(1_800_000);
  });

  it("REDIS_CACHE_TTL 은 초 단위여야 한다", () => {
    // 24시간 = 86,400s
    expect(REDIS_CACHE_TTL.ONE_DAY).toBe(86_400);
  });

  it("같은 이름의 두 상수는 정확히 1000배 관계여야 한다", () => {
    // 한쪽만 수정되어 단위가 어긋나는 상황을 잡아내기 위한 교차 검증입니다.
    expect(HTTP_CACHE_TTL.ONE_DAY).toBe(REDIS_CACHE_TTL.ONE_DAY * 1000);
  });
});
