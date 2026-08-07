import { Test, TestingModule } from "@nestjs/testing";
import { LibrariesController } from "./libraries.controller";
import { LibrariesService } from "./libraries.service";
import { LibrariesDbService } from "./libraries-db.service";
import { CACHE_MANAGER, CACHE_TTL_METADATA } from "@nestjs/cache-manager";
import { HTTP_CACHE_TTL } from "src/constant/cache-ttl";

describe("LibrariesController", () => {
  let controller: LibrariesController;
  let mockService: any;
  let mockDbService: any;

  beforeEach(async () => {
    // Controller에 필요한 의존성 서비스들을 모킹합니다.
    mockService = {
      findLibrariesByISBN__Web: jest.fn(),
      fetchLibrariesByISBN: jest.fn(),
    };
    mockDbService = {
      findByRegionCode: jest.fn(),
      findByLibCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrariesController],
      providers: [
        { provide: LibrariesService, useValue: mockService },
        { provide: LibrariesDbService, useValue: mockDbService },
        // NestJS의 CacheInterceptor가 내부적으로 의존하는 CACHE_MANAGER를 모킹하여 예외를 방지합니다.
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    controller = module.get<LibrariesController>(LibrariesController);
  });

  it("컨트롤러가 정의되어야 한다", () => {
    // 컨트롤러가 정상적으로 DI(의존성 주입)되어 인스턴스화되었는지 확인합니다.
    expect(controller).toBeDefined();
  });

  // @CacheTTL 의 인자는 밀리초입니다. 초 단위 계산식으로 되돌아가면
  // 캐시 시간이 1/1000 로 줄어드는데 응답은 정상이라 눈에 띄지 않습니다.
  describe("HTTP 캐시 TTL 메타데이터", () => {
    it.each([
      ["findLibrariesByISBN__Web", HTTP_CACHE_TTL.ONE_DAY],
      ["findLibrariesByISBN__Extension", HTTP_CACHE_TTL.THIRTY_MINUTES],
      ["findLibrariesByRegion", HTTP_CACHE_TTL.ONE_DAY],
      ["getLibInfo", HTTP_CACHE_TTL.ONE_DAY],
    ])("%s 핸들러의 TTL 은 밀리초 단위 %d 여야 한다", (methodName, expected) => {
      const handler = LibrariesController.prototype[methodName];
      expect(Reflect.getMetadata(CACHE_TTL_METADATA, handler)).toBe(expected);
    });
  });
});
