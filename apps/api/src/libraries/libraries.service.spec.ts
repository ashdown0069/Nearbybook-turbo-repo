import { Test, TestingModule } from "@nestjs/testing";
import { LibrariesService } from "./libraries.service";
import { LibrariesDbService } from "./libraries-db.service";
import { HttpService } from "@nestjs/axios";
import { of } from "rxjs";

describe("LibrariesService", () => {
  let service: LibrariesService;
  let mockHttpService: any;
  let mockDbService: any;

  beforeEach(async () => {
    mockHttpService = {
      get: jest.fn(),
    };
    mockDbService = {
      findByRegionCode: jest.fn(),
      upsertLibraries: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibrariesService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: LibrariesDbService, useValue: mockDbService },
      ],
    }).compile();

    service = module.get<LibrariesService>(LibrariesService);
  });

  it("findLibrariesByISBN__Web이 정상 리스트를 반환해야 한다", async () => {
    // API URL 경로에 따라 동적으로 모의 응답 데이터를 설정해 줍니다.
    mockHttpService.get.mockImplementation((url: string) => {
      if (url.includes("libSrchByBook")) {
        return of({
          data: {
            response: {
              libs: [
                {
                  lib: {
                    libCode: "111",
                    libName: "Test Lib 1",
                  },
                },
              ],
            },
          },
        });
      }
      if (url.includes("libSrch")) {
        return of({
          data: {
            response: {
              libs: [
                {
                  lib: {
                    libCode: "111",
                    libName: "Test Lib 1",
                  },
                },
              ],
            },
          },
        });
      }
      return of({ data: { response: {} } });
    });

    const result = await service.findLibrariesByISBN__Web("9788900000000", 11, 11010);
    
    // 매핑이 정상적으로 완료되고, 도서 정보 소장 유무(hasBook) 필드가 포함되어 있는지 검증합니다.
    expect(result).toBeDefined();
    expect(result).toEqual([
      {
        hasBook: true,
        libCode: "111",
        libName: "Test Lib 1",
      },
    ]);
  });

  it("getRegionLibraryList가 도서관 목록을 올바르게 가져와야 한다", async () => {
    // DB 조회 결과를 모킹합니다.
    mockDbService.findByRegionCode.mockResolvedValue([{ libCode: "111" }]);

    const result = await service.getRegionLibraryList(11, 11010);
    
    // DB에서 정상적으로 결과를 수신하는지 확인하고, 적절한 매개변수로 호출되었는지 검증합니다.
    expect(result).toEqual([{ libCode: "111" }]);
    expect(mockDbService.findByRegionCode).toHaveBeenCalledWith("11");
  });
});
