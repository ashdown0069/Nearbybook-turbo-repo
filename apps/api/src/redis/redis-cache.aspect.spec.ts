import { RedisCacheAspect } from "./redis-cache.aspect";

// ==========================================================
// [용어 설명 주석]
// 1. Aspect (어스펙트): 공통 관심사(횡단 관심사)를 모듈화한 객체입니다. 여기서는 캐싱 로직을 모듈화하였습니다.
// 2. Mocking (모킹): 테스트 대상이 의존하는 실제 객체(여기서는 Redis) 대신 모조 객체를 사용하여 독립적인 테스트를 수행하게 해줍니다.
// 3. Cache Hit (캐시 히트): 찾고자 하는 데이터가 캐시에 이미 존재하여 즉시 반환되는 상황을 뜻합니다.
// 4. Cache Miss (캐시 미스): 캐시에 데이터가 존재하지 않아 원래의 메서드를 직접 호출하여 데이터를 새로 가져와야 하는 상황입니다.
// 5. Wrap (래핑): 원래 호출하려던 함수나 메서드를 가로채서 그 앞뒤에 공통 로직(예: 캐시 확인 및 저장)을 덧붙이는 기법입니다.
// ==========================================================

describe("RedisCacheAspect", () => {
  let aspect: RedisCacheAspect;
  let mockRedis: any;

  beforeEach(() => {
    mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
    };
    aspect = new RedisCacheAspect(mockRedis);
  });

  it("캐시 히트 시 Redis 데이터를 반환하고 원본 메서드를 실행하지 않아야 한다", async () => {
    // Redis에 이미 데이터가 캐싱되어 있는 상황(Cache Hit)을 모킹합니다.
    mockRedis.get.mockResolvedValue(JSON.stringify({ data: "cached" }));
    const mockOriginalMethod = jest.fn();
    
    // AOP 래핑 규격에 따라 원래 메서드를 감싸는 래핑 함수를 생성합니다.
    const wrapped = aspect.wrap({
      method: mockOriginalMethod,
      metadata: { ttl: 60 },
      instance: { constructor: { name: "TestClass" } },
      methodName: "testMethod",
    });

    const result = await wrapped("param1");
    
    // 캐싱된 결과를 정상적으로 반환하고, 원래 메서드는 건너 뛰어야 합니다.
    expect(result).toEqual({ data: "cached" });
    expect(mockRedis.get).toHaveBeenCalled();
    expect(mockOriginalMethod).not.toHaveBeenCalled();
  });

  it("캐시 미스 시 원본 메서드를 실행하고 결과를 Redis에 저장해야 한다", async () => {
    // Redis에 데이터가 없는 상황(Cache Miss)을 모킹합니다.
    mockRedis.get.mockResolvedValue(null);
    const mockOriginalMethod = jest.fn().mockResolvedValue({ data: "fresh" });
    
    const wrapped = aspect.wrap({
      method: mockOriginalMethod,
      metadata: { ttl: 60 },
      instance: { constructor: { name: "TestClass" } },
      methodName: "testMethod",
    });

    const result = await wrapped("param1");
    
    // 새 데이터를 반환하고 원래 메서드를 실행하며, 그 결과를 Redis에 저장해야 합니다.
    expect(result).toEqual({ data: "fresh" });
    expect(mockOriginalMethod).toHaveBeenCalledWith("param1");
    expect(mockRedis.set).toHaveBeenCalled();
  });
});
