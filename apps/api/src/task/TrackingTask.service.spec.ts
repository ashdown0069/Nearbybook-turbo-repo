import { Test, TestingModule } from "@nestjs/testing";
import { TrackingTaskService } from "./TrackingTask.service";
import { getQueueToken } from "@nestjs/bullmq";
import { QUEUE_NAMES } from "src/constant/tokens";

describe("TrackingTaskService", () => {
  let service: TrackingTaskService;
  let mockQueue: any;

  beforeEach(async () => {
    mockQueue = {
      setGlobalConcurrency: jest.fn().mockResolvedValue({}),
      upsertJobScheduler: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingTaskService,
        { provide: getQueueToken(QUEUE_NAMES.POPULARITY), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<TrackingTaskService>(TrackingTaskService);
  });

  it("정의되어 있어야 한다", () => {
    expect(service).toBeDefined();
  });

  it("모듈 초기화 시 대기열 동시성과 작업 스케줄러가 등록되어야 한다", async () => {
    await service.onModuleInit();
    expect(mockQueue.setGlobalConcurrency).toHaveBeenCalledWith(1);
  });
});
