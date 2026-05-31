import { Test, TestingModule } from "@nestjs/testing";
import { SearchLogMiddleware } from "./search-log.middleware";
import { REDIS_CLIENT } from "src/constant/tokens";

describe("SearchLogMiddleware", () => {
  let middleware: SearchLogMiddleware;
  let mockRedis: any;
  let mockPipeline: any;

  beforeEach(async () => {
    mockPipeline = {
      hincrby: jest.fn().mockReturnThis(),
      sadd: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };

    mockRedis = {
      pipeline: jest.fn().mockReturnValue(mockPipeline),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchLogMiddleware,
        { provide: REDIS_CLIENT, useValue: mockRedis },
      ],
    }).compile();

    middleware = module.get<SearchLogMiddleware>(SearchLogMiddleware);
  });

  it("정의되어 있어야 한다", () => {
    expect(middleware).toBeDefined();
  });

  it("query와 mode가 유효할 때 Redis 파이프라인이 정상 동작해야 한다", async () => {
    const req = {
      query: { query: "nestjs", mode: "title" },
    } as any;
    const res = {} as any;
    const next = jest.fn();

    await middleware.use(req, res, next);

    expect(mockRedis.pipeline).toHaveBeenCalled();
    expect(mockPipeline.hincrby).toHaveBeenCalled();
    expect(mockPipeline.sadd).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("query나 mode가 비어있거나 무효하면 Redis 기록을 생략하고 next()를 호출해야 한다", async () => {
    const req = {
      query: { query: "", mode: "title" },
    } as any;
    const res = {} as any;
    const next = jest.fn();

    await middleware.use(req, res, next);

    expect(mockRedis.pipeline).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
