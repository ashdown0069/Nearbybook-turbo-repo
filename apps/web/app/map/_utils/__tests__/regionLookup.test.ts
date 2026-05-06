import { 
  findSiDoByName, 
  findSiDoByCode, 
  findSiGunGuByName, 
  findSiGunGuByCode,
  findRegionByNames,
  findRegionByCodes
} from "../regionLookup";

describe("regionLookup 유틸리티", () => {
  describe("findSiDoByName", () => {
    it("정확한 시/도 이름으로 검색할 수 있어야 한다", () => {
      const result = findSiDoByName("서울특별시");
      expect(result).toBeDefined();
      expect(result?.name).toBe("서울특별시");
      expect(result?.code).toBe("11");
    });

    it("부분 일치하는 이름으로 검색할 수 있어야 한다 (예: 서울 -> 서울특별시)", () => {
      const result = findSiDoByName("서울");
      expect(result?.name).toBe("서울특별시");
    });
  });

  describe("findSiDoByCode", () => {
    it("코드로 시/도를 검색할 수 있어야 한다", () => {
      const result = findSiDoByCode("11");
      expect(result?.name).toBe("서울특별시");
    });
  });

  describe("findSiGunGuByName", () => {
    it("시/도 이름과 시/군/구 이름으로 검색할 수 있어야 한다", () => {
      const result = findSiGunGuByName("서울특별시", "강남구");
      expect(result).toBeDefined();
      expect(result?.name).toBe("강남구");
    });

    it("존재하지 않는 시/도일 경우 undefined를 반환해야 한다", () => {
      const result = findSiGunGuByName("존재하지않는시도", "강남구");
      expect(result).toBeUndefined();
    });
  });

  describe("findRegionByNames", () => {
    it("시/도와 시/군/구 이름을 한 번에 검색해야 한다", () => {
      const result = findRegionByNames("서울", "강남구");
      expect(result?.siDo.code).toBe("11");
      expect(result?.siGunGu.name).toBe("강남구");
    });
  });

  describe("findRegionByCodes", () => {
    it("시/도와 시/군/구 코드를 한 번에 검색해야 한다", () => {
      const result = findRegionByCodes("11", "11230"); // 강남구 코드 가정
      expect(result?.siDo.name).toBe("서울특별시");
      expect(result?.siGunGu.code).toBe("11230");
    });
  });
});
