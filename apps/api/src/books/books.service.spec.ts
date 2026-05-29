import { Test, TestingModule } from "@nestjs/testing";
import { BooksService } from "./books.service";
import { HttpService } from "@nestjs/axios";
import { REDIS_CLIENT } from "src/constant/tokens";
import { of, throwError } from "rxjs";

describe("BooksService", () => {
  let service: BooksService;
  let mockHttpService: any;
  let mockRedis: any;

  beforeEach(async () => {
    mockHttpService = {
      get: jest.fn(),
      axiosRef: {
        get: jest.fn(),
        post: jest.fn(),
      },
    };
    mockRedis = {
      pipeline: jest.fn().mockReturnValue({
        hincrby: jest.fn().mockReturnThis(),
        hsetnx: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: REDIS_CLIENT, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  describe("searchBook__naver", () => {
    it("Naver API 조회 성공 시 정상 반환해야 한다", async () => {
      const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <total>1</total>
          <item>
            <title>Test Book</title>
            <author>Author</author>
            <publisher>Publisher</publisher>
            <pubdate>20201201</pubdate>
            <isbn>9788900000000</isbn>
            <image>http://image.url</image>
          </item>
        </channel>
      </rss>`;

      mockHttpService.axiosRef.get.mockResolvedValue({ data: xmlData });

      const result = await service.searchBook__naver("9788900000000");
      expect(result.bookname).toBe("Test Book");
      expect(result.authors).toBe("Author");
    });

    it("Naver API 조회 결과가 없으면 빈 객체를 반환해야 한다", async () => {
      const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <total>0</total>
        </channel>
      </rss>`;
      mockHttpService.axiosRef.get.mockResolvedValue({ data: xmlData });
      const result = await service.searchBook__naver("9788900000000");
      expect(result).toEqual({});
    });

    it("Naver API 에러 시 InternalServerErrorException을 발생시켜야 한다", async () => {
      mockHttpService.axiosRef.get.mockRejectedValue(new Error("Naver API Error"));
      await expect(service.searchBook__naver("9788900000000")).rejects.toThrow("searchBook__naver error");
    });
  });

  describe("searchBook", () => {
    it("도서관 빅데이터 API 조회 성공 시 도서 정보를 정상 반환해야 한다", async () => {
      const apiResponse = {
        data: {
          response: {
            detail: [
              {
                book: {
                  bookname: "API Book",
                  authors: "Author",
                },
              },
            ],
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(apiResponse));
      const result = await service.searchBook("9788900000000");
      expect(result.bookname).toBe("API Book");
    });

    it("도서관 빅데이터 API 실패 시 Naver API로 대체 호출해야 한다", async () => {
      mockHttpService.get.mockReturnValue(of({ data: { response: { error: "API Key Expired" } } }));
      const spyNaver = jest.spyOn(service, "searchBook__naver").mockResolvedValue({
        bookname: "Naver Book",
        authors: "Author",
        publisher: "Publisher",
        publication_year: "2021",
        isbn: "9788900000000",
        bookImageURL: "http://image.url",
      } as any);

      const result = await service.searchBook("9788900000000");
      expect(spyNaver).toHaveBeenCalledWith("9788900000000");
      expect(result.bookname).toBe("Naver Book");
    });

    it("도서관 빅데이터 API 응답이 유효하지 않으면 Naver API를 호출해야 한다", async () => {
      mockHttpService.get.mockReturnValue(of({ data: { response: { detail: [] } } }));
      const spyNaver = jest.spyOn(service, "searchBook__naver").mockResolvedValue({ bookname: "Fallback Book" } as any);
      const result = await service.searchBook("9788900000000");
      expect(spyNaver).toHaveBeenCalled();
      expect(result.bookname).toBe("Fallback Book");
    });
  });

  describe("searchBookLocation", () => {
    it("도서 소장 정보가 있으면 소장 정보와 위치를 올바르게 반환해야 한다", async () => {
      const apiResponse = {
        data: {
          response: {
            resultNum: "1",
            libNm: "서울도서관",
            docs: [
              {
                doc: {
                  class_no: "813.6",
                  callNumbers: [
                    {
                      callNumber: {
                        book_code: "v.1",
                        shelf_loc_name: "문학실",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(apiResponse));
      const result = await service.searchBookLocation(1001, "9788900000000");
      expect(result.hasBook).toBe(true);
      expect(result.libName).toBe("서울도서관");
      expect(result.shelfLocation).toBe("문학실");
      expect(result.bookCode).toBe("813.6-v.1");
    });

    it("도서 소장 정보가 없으면 hasBook=false 상태를 반환해야 한다", async () => {
      const apiResponse = {
        data: {
          response: {
            resultNum: "0",
            libNm: "서울도서관",
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(apiResponse));
      const result = await service.searchBookLocation(1001, "9788900000000");
      expect(result.hasBook).toBe(false);
      expect(result.libName).toBe("서울도서관");
    });
  });

  describe("searchBooks", () => {
    it("도서 목록 검색(title 모드) 성공 시 책 목록과 페이지 수를 반환해야 한다", async () => {
      const apiResponse = {
        data: {
          response: {
            numFound: 24,
            docs: [
              { doc: { bookname: "Book1", isbn13: "9788900000001" } },
              { doc: { bookname: "Book2", isbn13: "9788900000002" } },
            ],
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(apiResponse));
      const result = await service.searchBooks("title", "자바", 1);
      expect(result.pages).toBe(2);
      expect(result.numFound).toBe(24);
      expect(result.books.length).toBe(2);
    });

    it("검색 결과가 없으면 빈 목록을 반환해야 한다", async () => {
      mockHttpService.get.mockReturnValue(of({ data: { response: {} } }));
      const result = await service.searchBooks("isbn", "9788900000000", 1);
      expect(result.books).toEqual([]);
      expect(result.numFound).toBe(0);
    });
  });

  describe("getTrendingBooks", () => {
    it("트렌드 도서 조회 성공 시 중복 없는 최대 7개의 책 목록을 반환해야 한다", async () => {
      const apiResponse = {
        data: {
          response: {
            results: [
              {
                result: {
                  docs: [
                    { doc: { isbn13: "1111", bookname: "Trend1" } },
                    { doc: { isbn13: "1111", bookname: "Trend1" } }, // 중복
                    { doc: { isbn13: "2222", bookname: "Trend2" } },
                  ],
                },
              },
            ],
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(apiResponse));
      const result = await service.getTrendingBooks();
      expect(result.length).toBe(2);
      expect((result[0] as any).isbn13).toBe("1111");
      expect((result[1] as any).isbn13).toBe("2222");
    });

    it("API 에러 발생 시 빈 배열을 반환해야 한다", async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error("API Error")));
      const result = await service.getTrendingBooks();
      expect(result).toEqual([]);
    });
  });

  describe("getPopularLoanBooks", () => {
    it("인기 대출 도서 리스트를 정상 반환해야 한다", async () => {
      const apiResponse = {
        data: {
          response: {
            docs: [
              { doc: { bookname: "Popular1", isbn13: "123" } },
            ],
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(apiResponse));
      const result = await service.getPopularLoanBooks(10, 1, 5);
      expect(result.length).toBe(1);
      expect(result[0].bookname).toBe("Popular1");
    });
  });

  describe("getBookLoanStatus", () => {
    it("대출 가능 가능 여부 조회 성공 시 결과를 반환해야 한다", async () => {
      const apiResponse = {
        data: {
          response: {
            result: {
              loanAvailable: "Y",
            },
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(apiResponse));
      const result = await service.getBookLoanStatus("9788900000000", 1001);
      expect(result.loanAvailable).toBe("Y");
    });
  });

  describe("getAutocompleteSuggestions", () => {
    it("자동완성 조회 성공 시 hits 결과를 반환해야 한다", async () => {
      const hits = [{ bookname: "Autofill Book" }];
      mockHttpService.axiosRef.post.mockResolvedValue({
        data: {
          hits,
          query: "Auto",
          processingTimeMs: 5,
        },
      });
      const result = await service.getAutocompleteSuggestions("Auto");
      expect(result.hits).toEqual(hits);
      expect(result.query).toBe("Auto");
    });
  });

  describe("_trackingBook", () => {
    it("도서 조회 시 Redis 파이프라인에 도서 인기도 카운트 및 메타 정보를 등록해야 한다", async () => {
      const bookMeta = { title: "Tracked Book" } as any;
      await service._trackingBook("9788900000000", bookMeta);
      expect(mockRedis.pipeline).toHaveBeenCalled();
    });

    it("전달된 도서 정보가 빈 객체인 경우 작업을 건너뛰어야 한다", async () => {
      await service._trackingBook("9788900000000", {} as any);
      expect(mockRedis.pipeline).not.toHaveBeenCalled();
    });
  });
});
