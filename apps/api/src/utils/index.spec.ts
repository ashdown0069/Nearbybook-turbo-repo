import { formatDate, getDateRange, is13DigitNumber } from "./index";

describe("Utils Index Helpers", () => {
  it("formatDate가 날짜를 YYYY-MM-DD 형식으로 변환해야 한다", () => {
    // 2026-05-29 날짜 객체 생성 (Date 객체는 JavaScript/TypeScript에서 날짜와 시간을 표현하는 기본 빌트인 객체입니다)
    const date = new Date("2026-05-29T12:00:00Z");
    expect(formatDate(date)).toBe("2026-05-29");
  });

  it("is13DigitNumber가 13자리 숫자를 정확히 검증해야 한다", () => {
    // 13자리 숫자로 이루어진 문자열은 true를 반환해야 함
    expect(is13DigitNumber("9788900000000")).toBe(true);
    // 대시(-)가 포함되어 있거나 13자리가 아닌 문자열은 false를 반환해야 함
    expect(is13DigitNumber("978-890")).toBe(false);
    // 문자가 포함되어 있는 문자열은 false를 반환해야 함
    expect(is13DigitNumber("abc")).toBe(false);
  });
});
