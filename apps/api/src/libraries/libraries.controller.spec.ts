import { Test, TestingModule } from "@nestjs/testing";
import { LibrariesController } from "./libraries.controller";
import { LibrariesService } from "./libraries.service";
import { LibrariesDbService } from "./libraries-db.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

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
});
