import { Test, TestingModule } from "@nestjs/testing";
import { MeilisearchService } from "./meilisearch.service";
import { MEILISEARCH_ADMIN_CLIENT } from "./meilisearch.contant";

describe("MeilisearchService", () => {
  let service: MeilisearchService;
  let mockClient: any;
  let mockIndex: any;

  beforeEach(async () => {
    mockIndex = {
      addDocuments: jest.fn().mockResolvedValue({ taskUid: 1 }),
      search: jest.fn().mockResolvedValue({ hits: [] }),
    };
    mockClient = {
      index: jest.fn().mockReturnValue(mockIndex),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeilisearchService,
        { provide: MEILISEARCH_ADMIN_CLIENT, useValue: mockClient },
      ],
    }).compile();

    service = module.get<MeilisearchService>(MeilisearchService);
  });

  it("문서 색인 추가 동작이 정상 동작해야 한다", async () => {
    const mockBook = {
      isbn: "9788900000000",
      title: "Test Book",
      authors: "Author",
      publisher: "Publisher",
      publicationYear: 2023,
      vol: "1",
      loanCount: 0,
      popularity: 0,
      kdc: "100",
      bookImageURL: "",
    } as any;

    await service.addBooksDocuments([mockBook], "books");
    expect(mockClient.index).toHaveBeenCalledWith("books");
    expect(mockIndex.addDocuments).toHaveBeenCalled();
  });
});
