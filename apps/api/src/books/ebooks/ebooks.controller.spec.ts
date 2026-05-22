import { Test, TestingModule } from "@nestjs/testing";
import { EbooksController } from "./ebooks.controller";
import { EbooksService } from "./ebooks.service";

describe("EbooksController", () => {
  let controller: EbooksController;
  let service: EbooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EbooksController],
      providers: [
        {
          provide: EbooksService,
          useValue: {
            searchEbooks: jest.fn().mockResolvedValue({ pages: 1, books: [], numFound: 0 }),
          },
        },
      ],
    }).compile();

    controller = module.get<EbooksController>(EbooksController);
    service = module.get<EbooksService>(EbooksService);
  });

  it("컨트롤러가 정의되어 있어야 한다", () => {
    expect(controller).toBeDefined();
  });

  it("검색 요청 시 서비스의 searchEbooks를 호출해야 한다", async () => {
    const result = await controller.searchEbooks({ mode: "title", query: "test", pageNo: 1 });
    expect(service.searchEbooks).toHaveBeenCalledWith("title", "test", 1);
    expect(result).toEqual({ pages: 1, books: [], numFound: 0 });
  });
});
