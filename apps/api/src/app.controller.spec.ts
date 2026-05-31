import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommonService } from "./common/common.service";

describe("AppController", () => {
  let appController: AppController;
  let commonService: jest.Mocked<CommonService>;

  beforeEach(async () => {
    commonService = {
      sendMessageToDiscord: jest.fn().mockResolvedValue(true),
    } as any;

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: CommonService, useValue: commonService },
        { provide: "CACHE_MANAGER", useValue: {} },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("healthCheck", () => {
    it("서버 상태가 ok여야 한다 (status='ok')", async () => {
      const result = await appController.healthCheck();
      expect(result.status).toBe("ok");
      expect(result.hostname).toBeDefined();
    });
  });

  describe("feedback", () => {
    it("피드백 데이터를 Discord로 정상 전송해야 한다", async () => {
      const dto = { title: "건의사항", description: "도서관 검색이 잘 돼요", email: "user@example.com" };
      const result = await appController.feedback(dto);
      expect(commonService.sendMessageToDiscord).toHaveBeenCalledWith(
        dto.title,
        dto.description,
        "Feedback",
        dto.email
      );
      expect(result).toBe(true);
    });
  });
});
