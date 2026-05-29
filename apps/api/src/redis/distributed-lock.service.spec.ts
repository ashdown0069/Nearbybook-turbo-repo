import { Test, TestingModule } from "@nestjs/testing";
import { REDIS_CLIENT } from "src/constant/tokens";
import { DistributedLockService } from "./distributed-lock.service";

// ==========================================================
// [용어 설명 주석]
// 1. TestingModule (테스팅 모듈): NestJS 애플리케이션의 의존성 주입(DI) 컨테이너를 테스트 목적으로 격리하여 구성한 객체입니다.
// 2. REDIS_CLIENT (레디스 클라이언트 토큰): Redis 모듈과 서비스에서 Redis 인스턴스에 접근하기 위해 사용하는 고유한 의존성 주입 키입니다.
// 3. Eval (이발 연산): Redis 내부에서 Lua 스크립트를 원자적으로 실행할 수 있게 하여 락 해제 과정의 원자성을 보장해 주는 명령어입니다.
// 4. In-memory Mock Store (인메모리 모조 저장소): 외부 DB나 캐시 시스템 없이 로컬 메모리 Map을 통해 실제 저장소처럼 동작하도록 임시 구현한 테스트 기법입니다.
// ==========================================================

describe("DistributedLockService (Mock Redis)", () => {
  let module: TestingModule;
  let mockRedis: any;
  let lockService: DistributedLockService;
  let mockRedisStore: Map<string, string>;

  beforeEach(async () => {
    // 락 정보를 기록할 가상의 인메모리 저장소(Map)를 생성합니다.
    mockRedisStore = new Map<string, string>();
    mockRedis = {
      // 락 획득 시 사용되는 set(NX 옵션) 동작을 모킹하여 시뮬레이션합니다.
      set: jest.fn().mockImplementation((key, val, ex, ttl, nx) => {
        if (nx === "NX") {
          if (mockRedisStore.has(key)) {
            return null; // 이미 존재하는 키라면 null 반환 (락 획득 실패)
          }
          mockRedisStore.set(key, val);
          return "OK"; // 락 획득 성공
        }
        mockRedisStore.set(key, val);
        return "OK";
      }),
      // 락 해제 시 사용되는 eval(Lua 스크립트 실행) 동작을 시뮬레이션합니다.
      eval: jest.fn().mockImplementation((script, numKeys, key, arg) => {
        if (mockRedisStore.get(key) === arg) {
          mockRedisStore.delete(key);
          return 1; // 락 해제 성공
        }
        return 0; // 본인이 소유한 락이 아니거나 락이 없는 경우 해제 실패
      }),
    };

    module = await Test.createTestingModule({
      providers: [
        { provide: REDIS_CLIENT, useValue: mockRedis },
        DistributedLockService,
      ],
    }).compile();

    lockService = module.get(DistributedLockService);
  });

  it("락 획득에 성공한다", async () => {
    const result = await lockService.tryAcquire("test-key", 10);
    expect(result).toBe(true);
  });

  it("동일 키에 대해 이중 획득이 불가능하다", async () => {
    await lockService.tryAcquire("test-key", 10);
    const second = await lockService.tryAcquire("test-key", 10);
    expect(second).toBe(false);
  });

  it("락 해제 후 같은 키를 재획득할 수 있다", async () => {
    await lockService.tryAcquire("test-key", 10);
    const released = await lockService.release("test-key");
    expect(released).toBe(true);

    const reacquired = await lockService.tryAcquire("test-key", 10);
    expect(reacquired).toBe(true);
  });
});
