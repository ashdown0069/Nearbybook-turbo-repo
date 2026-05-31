import { searchLogs } from "./searchLogs";

describe("searchLogs 스키마 정의 테스트", () => {
  it("searchDate와 count 컬럼이 존재해야 한다", () => {
    expect(searchLogs.searchDate).toBeDefined();
    expect(searchLogs.count).toBeDefined();
  });
});
