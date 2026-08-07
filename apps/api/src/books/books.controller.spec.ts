import { Test, TestingModule } from "@nestjs/testing";
import { BooksController } from "./books.controller";
import { BooksService } from "./books.service";
import { CACHE_MANAGER, CACHE_TTL_METADATA } from "@nestjs/cache-manager"; // [CACHE_MANAGER]: NestJS 캐싱 관리를 위한 의존성 주입 토큰
import { HTTP_CACHE_TTL } from "src/constant/cache-ttl";

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

  // ==========================================================
  // [용어 설명 주석]
  // 1. 메타데이터(Metadata): 데코레이터가 클래스나 메서드에 몰래 붙여 두는 부가 정보입니다.
  //    @CacheTTL(x) 는 내부적으로 SetMetadata(CACHE_TTL_METADATA, x) 이므로,
  //    핸들러 함수에서 그 값을 그대로 읽어올 수 있습니다.
  // 2. 이 테스트가 필요한 이유: @CacheTTL 의 인자는 초가 아니라 '밀리초'입니다.
  //    초 단위 계산식(60*60*24)으로 되돌아가면 캐시가 1/1000 로 짧아지는데,
  //    응답은 여전히 정상이라 기능 테스트로는 절대 잡히지 않습니다.
  // ==========================================================
  describe("HTTP 캐시 TTL 메타데이터", () => {
    it.each([
      ["searchBooks", HTTP_CACHE_TTL.ONE_DAY],
      ["getTrendingBooks", HTTP_CACHE_TTL.ONE_DAY],
      ["getBookLoanStatus", HTTP_CACHE_TTL.THIRTY_MINUTES],
      ["getPopularLoanBooks", HTTP_CACHE_TTL.ONE_DAY],
      ["searchBookLocation", HTTP_CACHE_TTL.ONE_DAY],
    ])("%s 핸들러의 TTL 은 밀리초 단위 %d 여야 한다", (methodName, expected) => {
      const handler = BooksController.prototype[methodName];
      expect(Reflect.getMetadata(CACHE_TTL_METADATA, handler)).toBe(expected);
    });

    it("캐싱하지 않는 라우트에는 TTL 메타데이터가 없어야 한다", () => {
      // /autocomplete 과 /search/:isbn 은 의도적으로 컨트롤러 캐시를 두지 않습니다.
      // (searchBook 은 서비스 계층의 @RedisCache 가 담당)
      expect(
        Reflect.getMetadata(
          CACHE_TTL_METADATA,
          BooksController.prototype.getAutocompleteSuggestions,
        ),
      ).toBeUndefined();
      expect(
        Reflect.getMetadata(CACHE_TTL_METADATA, BooksController.prototype.searchBook),
      ).toBeUndefined();
    });
  });
});
