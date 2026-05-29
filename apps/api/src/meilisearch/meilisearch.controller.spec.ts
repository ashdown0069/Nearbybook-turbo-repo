import { Test, TestingModule } from "@nestjs/testing";
import { MeilisearchController } from "./meilisearch.controller";
import { MeilisearchService } from "./meilisearch.service";

describe("MeilisearchController", () => {
  let controller: MeilisearchController;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      healthCheck: jest.fn().mockResolvedValue({ status: "available" }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeilisearchController],
      providers: [{ provide: MeilisearchService, useValue: mockService }],
    }).compile();

    controller = module.get<MeilisearchController>(MeilisearchController);
  });

  it("컨트롤러가 정의되어야 한다", () => {
    expect(controller).toBeDefined();
  });
});
