import { TransformLoanBookRes } from "./transform";

describe("Transform Utilities", () => {
  it("API 도서 데이터를 올바르게 엔티티 구조로 정규화 변환해야 한다", () => {
    const rawData = [
      {
        doc: {
          bookname: "자바스크립트 완벽 가이드",
          authors: "David Flanagan",
          publisher: "인사이트",
          publication_year: "2022",
          isbn13: "9788966263745",
          vol: "1",
          loan_count: "25",
          bookImageURL: "http://image.url",
        },
      },
    ];

    const result = TransformLoanBookRes(
      rawData.map((item) => item.doc) as any,
      "5",
      "2026-05-01"
    );

    expect(result.records.length).toBe(1);
    expect(result.records[0].isbn).toBe("9788966263745");
    expect(result.records[0].loanCount).toBe(25);
    expect(result.records[0].kdc).toBe("5");
    expect(result.records[0].baseDate).toEqual(["2026-05-01"]);
  });

  it("ISBN이 13자리가 아니면 해당 항목을 스킵해야 한다", () => {
    const rawData = [
      { bookname: "올바른 책", isbn13: "9788966263745" },
      { bookname: "잘못된 ISBN", isbn13: "12345" },
    ];
    const result = TransformLoanBookRes(rawData as any, "5", "2026-05-01");
    expect(result.records.length).toBe(1);
    expect(result.skippedCount).toBe(1);
  });

  it("bookname이 비어있으면 해당 항목을 스킵해야 한다", () => {
    const rawData = [
      { bookname: "", isbn13: "9788966263745" },
    ];
    const result = TransformLoanBookRes(rawData as any, "5", "2026-05-01");
    expect(result.records.length).toBe(0);
    expect(result.skippedCount).toBe(1);
  });

  it("물음표로 시작하는 bookname은 인코딩 문제로 간주하여 스킵해야 한다", () => {
    const rawData = [
      { bookname: "?깨진인코딩제목", isbn13: "9788966263745" },
    ];
    const result = TransformLoanBookRes(rawData as any, "5", "2026-05-01");
    expect(result.records.length).toBe(0);
    expect(result.skippedCount).toBe(1);
  });

  it("vol이 숫자가 아니거나 99를 초과하면 vol 필드를 null로 설정해야 한다", () => {
    const rawData = [
      { bookname: "책 1", isbn13: "9788966263745", vol: "abc" },
      { bookname: "책 2", isbn13: "9788966263746", vol: "100" },
      { bookname: "책 3", isbn13: "9788966263747", vol: "" },
      { bookname: "책 4", isbn13: "9788966263748", vol: "5" },
    ];
    const result = TransformLoanBookRes(rawData as any, "5", "2026-05-01");
    expect(result.records.length).toBe(4);
    expect(result.records[0].vol).toBeNull();
    expect(result.records[1].vol).toBeNull();
    expect(result.records[2].vol).toBeNull();
    expect(result.records[3].vol).toBe("5");
  });
});
