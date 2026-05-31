import { Test, TestingModule } from "@nestjs/testing";
import { SearchLogTaskService } from "./SearchLogTask.service";
import { getQueueToken } from "@nestjs/bullmq";
import { QUEUE_NAMES } from "src/constant/tokens";

describe("SearchLogTaskService 테스트", () => {
  let service: SearchLogTaskService;
  let mockQueue: any;

  beforeEach(async () => {
    // 큐(Queue) 동작을 모방하기 위한 목(Mock) 객체 정의
    mockQueue = {
      setGlobalConcurrency: jest.fn().mockResolvedValue({}),
      upsertJobScheduler: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchLogTaskService,
        { provide: getQueueToken(QUEUE_NAMES.SEARCH_LOG), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<SearchLogTaskService>(SearchLogTaskService);
  });

  it("정의되어 있어야 한다", () => {
    expect(service).toBeDefined();
  });

  it("모듈 초기화 시 대기열 동시성과 30분 주기 작업 스케줄러가 등록되어야 한다", async () => {
    await service.onModuleInit();
    expect(mockQueue.setGlobalConcurrency).toHaveBeenCalledWith(1);
    expect(mockQueue.upsertJobScheduler).toHaveBeenCalledWith(
      "flush-search-logs-job",
      expect.objectContaining({ pattern: "0 */30 * * * *" }) // EVERY_30_MINUTES (30분 주기 스케줄러 패턴)
    );
  });
});
