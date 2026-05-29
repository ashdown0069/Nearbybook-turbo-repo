import { Test, TestingModule } from "@nestjs/testing";
import { PopularityProcessor } from "./popularity.processor";
import { REDIS_CLIENT } from "src/constant/tokens";
import { DATABASE_CONNECTION } from "src/database/database.provider";
import { MeilisearchService } from "src/meilisearch/meilisearch.service";

describe("PopularityProcessor", () => {
  let processor: PopularityProcessor;
  let mockRedis: any;
  let mockDb: any;
  let mockMeili: any;
  let originalEnv: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  beforeEach(async () => {
    mockRedis = {
      exists: jest.fn().mockResolvedValue(1),
      rename: jest.fn().mockResolvedValue("OK"),
      hgetall: jest.fn().mockResolvedValue({}),
      del: jest.fn(),
    };
    mockDb = {
      transaction: jest.fn().mockImplementation((cb) => cb(mockDb)),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      onConflictDoUpdate: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([{ id: 1, isbn: "9788900000000", title: "Popular Book" }]),
    };
    mockMeili = {
      addBooksDocuments: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PopularityProcessor,
        { provide: REDIS_CLIENT, useValue: mockRedis },
        { provide: DATABASE_CONNECTION, useValue: mockDb },
        { provide: MeilisearchService, useValue: mockMeili },
      ],
    }).compile();

    processor = module.get<PopularityProcessor>(PopularityProcessor);
  });

  it("트래킹 데이터를 플러시하고 DB 및 Meili에 연동 완료해야 한다", async () => {
    mockRedis.hgetall.mockImplementation((key: string) => {
      if (key.includes("count")) return { "9788900000000": "3" };
      return { "9788900000000": JSON.stringify({ bookname: "Popular Book" }) };
    });

    const job = { name: "flush-job", data: {} } as any;
    await processor.process(job);

    expect(mockRedis.rename).toHaveBeenCalled();
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockMeili.addBooksDocuments).toHaveBeenCalled();
  });
});
