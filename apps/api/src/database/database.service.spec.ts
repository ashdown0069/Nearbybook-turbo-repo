import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "./database.service";

describe("DatabaseService", () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it("서비스가 정의되어 있고 정상적으로 로드되어야 한다", () => {
    expect(service).toBeDefined();
  });
});
