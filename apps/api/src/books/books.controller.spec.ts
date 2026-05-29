import { Test, TestingModule } from "@nestjs/testing";
import { BooksController } from "./books.controller";
import { BooksService } from "./books.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager"; // [CACHE_MANAGER]: NestJS 캐싱 관리를 위한 의존성 주입 토큰

describe("BooksController", () => {
  let controller: BooksController;
  let service: jest.Mocked<BooksService>; // [jest.Mocked]: 실제 클래스의 메서드들을 Jest Mock 함수들로 래핑하여 타입 안정성을 제공하는 유틸리티 타입

  beforeEach(async () => {
    const mockBooksService = {
      getAutocompleteSuggestions: jest.fn(),
      searchBooks: jest.fn(),
      searchBook: jest.fn(),
      _trackingBook: jest.fn().mockResolvedValue(true), // [mockResolvedValue]: 비동기 프로미스가 정상적으로 이행(resolve)되었을 때의 결과값을 모킹하는 함수
      getTrendingBooks: jest.fn(),
      getBookLoanStatus: jest.fn(),
      getPopularLoanBooks: jest.fn(),
      searchBookLocation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({ // [TestingModule]: NestJS IoC 컨테이너를 모사하여 테스트 환경을 구성하는 헬퍼 클래스
      controllers: [BooksController],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: CACHE_MANAGER, useValue: {} }, // [CACHE_MANAGER]: CacheInterceptor가 사용하는 캐시 매니저 의존성을 빈 객체로 모킹하여 주입
      ],
    }).compile(); // [compile]: 모듈 정의를 분석하여 실제 IoC 컨테이너와 동일하게 인스턴스들을 준비시키는 비동기 메서드

    controller = module.get<BooksController>(BooksController);
    service = module.get(BooksService);
  });

  it("컨트롤러가 정상적으로 로드되어 있어야 한다", () => {
    expect(controller).toBeDefined();
  });

  it("searchBook 호출 시 서비스로 포워딩해야 한다", async () => {
    service.searchBook.mockResolvedValue({ bookname: "test" } as any);
    const result = await controller.searchBook("9788900000000");
    expect(service.searchBook).toHaveBeenCalledWith("9788900000000");
    expect(result).toEqual({ bookname: "test" });
  });
});
