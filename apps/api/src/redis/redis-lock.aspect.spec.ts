import { RedisLockAspect } from "./redis-lock.aspect";

// ==========================================================
// [용어 설명 주석]
// 1. Distributed Lock (분산 락): 여러 서버나 인스턴스가 동시에 동일한 핵심 자원에 접근하는 것을 조율하고 방지하기 위해 사용하는 동기화 메커니즘입니다.
// 2. Acquire (락 획득): 동시 접근을 제어하기 위해 락의 소유권을 일시적으로 획득(잠금)하는 동작을 의미합니다.
// 3. Release (락 해제): 자원 사용이 끝난 후 다른 요청이 자원을 이용할 수 있도록 락을 풀어주는 동작입니다.
// ==========================================================

describe("RedisLockAspect", () => {
  let aspect: RedisLockAspect;
  let mockLockService: any;

  beforeEach(() => {
    mockLockService = {
      tryAcquire: jest.fn(),
      release: jest.fn(),
    };
    aspect = new RedisLockAspect(mockLockService);
  });

  it("분산 락을 획득하고 완료 후 해제해야 한다", async () => {
    // 분산 락 획득에 성공한 경우를 모킹합니다.
    mockLockService.tryAcquire.mockResolvedValue(true);
    const mockOriginalMethod = jest.fn().mockResolvedValue("done");
    
    const wrapped = aspect.wrap({
      method: mockOriginalMethod,
      metadata: { key: "lockKey", ttlSeconds: 10 },
      instance: {},
      methodName: "testMethod",
    });

    const result = await wrapped("param1");
    
    // 정상적으로 작업을 수행한 뒤 락을 정상적으로 해제해야 합니다.
    expect(result).toBe("done");
    expect(mockLockService.tryAcquire).toHaveBeenCalledWith("lockKey", 10);
    expect(mockLockService.release).toHaveBeenCalledWith("lockKey");
    expect(mockOriginalMethod).toHaveBeenCalledWith("param1");
  });

  it("락 획득 실패 시 원래 메서드를 실행하지 않고 바로 반환해야 한다", async () => {
    // 락 획득에 실패한 경우(다른 프로세스가 이미 락을 점유 중)를 모킹합니다.
    mockLockService.tryAcquire.mockResolvedValue(false);
    const mockOriginalMethod = jest.fn();
    
    const wrapped = aspect.wrap({
      method: mockOriginalMethod,
      metadata: { key: "lockKey", ttlSeconds: 10 },
      instance: {},
      methodName: "testMethod",
    });

    const result = await wrapped("param1");
    
    // 락을 획득하지 못했으므로 원본 메서드를 실행하지 않고 곧바로 반환되어야 합니다.
    expect(result).toBeUndefined();
    expect(mockOriginalMethod).not.toHaveBeenCalled();
    expect(mockLockService.release).not.toHaveBeenCalled();
  });
});
