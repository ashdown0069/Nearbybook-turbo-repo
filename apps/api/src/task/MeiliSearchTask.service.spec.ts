import { Test, TestingModule } from "@nestjs/testing";
import { MeiliSearchTaskService } from "./MeiliSearchTask.service";
import { HttpService } from "@nestjs/axios";
import { BooksService } from "src/books/books.service";
import { MeilisearchService } from "src/meilisearch/meilisearch.service";
import { DATABASE_CONNECTION } from "src/database/database.provider";
import { CommonService } from "src/common/common.service";
import { of } from "rxjs";

describe("MeiliSearchTaskService", () => {
  let service: MeiliSearchTaskService;
  let mockHttp: any;
  let mockDb: any;
  let mockBooksService: any;
  let mockMeilisearch: any;

  beforeEach(async () => {
    mockHttp = {
      get: jest.fn().mockReturnValue(of({ data: { response: { docs: [] } } })),
    };
    mockDb = {
      transaction: jest.fn().mockImplementation((cb) => cb(mockDb)),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      onConflictDoUpdate: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([{ id: 1, title: "book" }]),
    };
    mockBooksService = {
      getPopularLoanBooks: jest.fn().mockResolvedValue([]),
    };
    mockMeilisearch = {
      addBooksDocuments: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeiliSearchTaskService,
        { provide: HttpService, useValue: mockHttp },
        { provide: BooksService, useValue: mockBooksService },
        { provide: MeilisearchService, useValue: mockMeilisearch },
        { provide: DATABASE_CONNECTION, useValue: mockDb },
        { provide: CommonService, useValue: {} },
      ],
    }).compile();

    service = module.get<MeiliSearchTaskService>(MeiliSearchTaskService);
  });

  it("정의되어 있어야 한다", () => {
    expect(service).toBeDefined();
  });

  it("saveScrapedDataToDB가 배치 저장을 성공적으로 처리해야 한다", async () => {
    const result = await service.saveScrapedDataToDB();
    expect(result).toBeDefined();
    expect(mockDb.transaction).toHaveBeenCalled();
  });
});
