import { Test, TestingModule } from "@nestjs/testing";
import { CommonService } from "./common.service";
import { HttpService } from "@nestjs/axios";

describe("CommonService", () => {
  let service: CommonService;
  let mockHttpService: any;

  beforeEach(async () => {
    // HttpService의 axiosRef를 모킹하여 외부 API 호출을 차단하고 가상 성공 응답을 반환하도록 설정합니다.
    mockHttpService = {
      axiosRef: {
        post: jest.fn().mockResolvedValue({ data: "success" }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<CommonService>(CommonService);
  });

  it("개발 환경에서는 Discord 요청을 스킵해야 한다", async () => {
    // 환경변수 NODE_ENV를 개발(development) 환경으로 모킹합니다.
    process.env.NODE_ENV = "development";
    const result = await service.sendMessageToDiscord("제목", "내용", "Feedback");
    expect(result).toBe(true);
    expect(mockHttpService.axiosRef.post).not.toHaveBeenCalled();
  });

  it("운영/프로덕션 환경에서는 Discord Webhook을 정상 호출해야 한다", async () => {
    // 환경변수 NODE_ENV를 운영(production) 환경으로 모킹하고, 필요한 Webhook URL을 주입합니다.
    process.env.NODE_ENV = "production";
    process.env.DISCORD_WEBHOOK_URL = "https://discord.webhook.com";
    const result = await service.sendMessageToDiscord("제목", "내용", "Error", "test@test.com");
    expect(result).toBe(true);
    expect(mockHttpService.axiosRef.post).toHaveBeenCalled();
  });
});
