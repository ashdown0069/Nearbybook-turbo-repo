import { Test, TestingModule } from "@nestjs/testing";
import { LibrariesDbService } from "./libraries-db.service";
import { DATABASE_CONNECTION } from "src/database/database.provider";

describe("LibrariesDbService", () => {
  let service: LibrariesDbService;
  let mockDb: any;

  beforeEach(async () => {
    // Drizzle ORM의 메서드 체이닝을 원활하게 모킹하기 위해 mockReturnThis()를 적극적으로 활용합니다.
    mockDb = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      onConflictDoUpdate: jest.fn().mockResolvedValue(undefined as any),
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      // 최종 결과를 반환하는 limit 메서드에 가상의 도서관 데이터를 모킹합니다.
      limit: jest.fn().mockResolvedValue([{ libCode: "123", libName: "Test Lib" }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibrariesDbService,
        { provide: DATABASE_CONNECTION, useValue: mockDb },
      ],
    }).compile();

    service = module.get<LibrariesDbService>(LibrariesDbService);
  });

  it("findByLibCode가 단일 도서관 정보를 올바르게 가져와야 한다", async () => {
    const result = await service.findByLibCode("123");
    
    // 모킹된 DB를 통해 받아온 결과값이 일치하는지 검증합니다.
    expect(result).toEqual({ libCode: "123", libName: "Test Lib" });
    
    // DB 조회(select) 쿼리가 실행되었는지 검증합니다.
    expect(mockDb.select).toHaveBeenCalled();
  });
});
