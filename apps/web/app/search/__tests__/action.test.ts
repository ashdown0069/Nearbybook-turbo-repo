import { redirect } from "next/navigation";
import { searchAction } from "../action";
import "@testing-library/jest-dom";
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

beforeEach(() => {
  (redirect as unknown as jest.Mock).mockClear();
});

describe("searchAction Server Action", () => {
  const prevState = {}; // 이전 상태 (현재 로직에서는 사용되지 않음)

  // --- 유효성 검사 실패 케이스 ---
  describe("Validation Failures", () => {
    it("has no query", async () => {
      const formData = new FormData();
      formData.append("query", "");
      formData.append("mode", "title");

      const result = await searchAction(prevState, formData);

      expect(result).toEqual({
        query: "",
        mode: "title",
        error: "검색어를 입력해주세요.",
        success: false,
      });
      expect(redirect).not.toHaveBeenCalled();
    });

    it("is less than 2 char", async () => {
      const formData = new FormData();
      formData.append("query", "책");
      formData.append("mode", "title");

      const result = await searchAction(prevState, formData);

      expect(result).toEqual({
        query: "책",
        mode: "title",
        error: "검색어는 최소 2글자 이상 입력해주세요.",
        success: false,
      });
      expect(redirect).not.toHaveBeenCalled();
    });

    it("is not ISBN format", async () => {
      const formData = new FormData();
      formData.append("query", "12345abc");
      formData.append("mode", "isbn");

      const result = await searchAction(prevState, formData);

      expect(result).toEqual({
        query: "12345abc",
        mode: "isbn",
        error: "ISBN은 숫자만 입력가능합니다.",
        success: false,
      });
      expect(redirect).not.toHaveBeenCalled();
    });

    it("is not 13 char ISBN", async () => {
      const formData = new FormData();
      formData.append("query", "123456789012"); // 12자리
      formData.append("mode", "isbn");

      const result = await searchAction(prevState, formData);

      expect(result).toEqual({
        query: "123456789012",
        mode: "isbn",
        error: "ISBN은 13자리여야 합니다.",
        success: false,
      });
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  // --- 유효성 검사 성공 및 리다이렉트 케이스 ---
  describe("Validation Success and Redirect", () => {
    it("is valid query and mode", async () => {
      const query = "자바스크립트";
      const formData = new FormData();
      formData.append("query", query);
      formData.append("mode", "title");

      // redirect는 예외를 발생시키므로 try-catch로 감싸거나, jest의 .toThrow()를 사용할 수 있습니다.
      // 여기서는 redirect가 호출되었는지 확인하는 것으로 충분합니다.
      await searchAction(prevState, formData);

      const expectedUrl = `/search?query=${encodeURIComponent(
        query,
      )}&mode=title&pageNo=1`;
      expect(redirect).toHaveBeenCalledWith(expectedUrl);
      expect(redirect).toHaveBeenCalledTimes(1);
    });

    it("is valid ISBN", async () => {
      const query = "9788966262281";
      const formData = new FormData();
      formData.append("query", query);
      formData.append("mode", "isbn");

      await searchAction(prevState, formData);

      const expectedUrl = `/search?query=${query}&mode=isbn&pageNo=1`;
      expect(redirect).toHaveBeenCalledWith(expectedUrl);
      expect(redirect).toHaveBeenCalledTimes(1);
    });

    it("is valid query with special characters", async () => {
      const query = "C++ & C#";
      const formData = new FormData();
      formData.append("query", query);
      formData.append("mode", "title");

      await searchAction(prevState, formData);

      const expectedUrl = `/search?query=${encodeURIComponent(query)}&mode=title&pageNo=1`;
      expect(redirect).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
