import { Test, TestingModule } from "@nestjs/testing";
import { EbooksService } from "./ebooks.service";
import { HttpService } from "@nestjs/axios";
import { of } from "rxjs";

describe("EbooksService", () => {
  let service: EbooksService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EbooksService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EbooksService>(EbooksService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("서비스가 정의되어 있어야 한다", () => {
    expect(service).toBeDefined();
  });

  it("OpenAPI를 호출하고 결과를 올바르게 변환해야 한다", async () => {
    const mockData = {
      TOTAL_COUNT: "25",
      docs: [{ TITLE: "Test Ebook", EA_ISBN: "1234567890123" }]
    };
    
    jest.spyOn(httpService, 'get').mockReturnValue(of({ data: mockData } as any));

    const result = await service.searchEbooks("title", "test", 1);

    expect(result.numFound).toBe(25);
    expect(result.pages).toBe(3); // 25 / 10 = 2.5 -> 3
    expect(result.books).toHaveLength(1);
    expect(result.books[0].TITLE).toBe("Test Ebook");
  });
});
