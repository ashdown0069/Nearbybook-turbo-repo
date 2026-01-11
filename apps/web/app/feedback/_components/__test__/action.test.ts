import { redirect } from "next/navigation";
import { sendFeedback } from "@repo/data-access";
import { submitFeedback } from "../../action";
import { axiosInstance } from "@/lib/axios";

// 의존성 모킹(Mocking)
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/lib/axios", () => ({
  axiosInstance: {},
}));

jest.mock("@repo/data-access", () => ({
  sendFeedback: jest.fn(),
}));

// 테스트 편의를 위해 모킹된 함수에 타입 캐스팅 적용
const mockedRedirect = redirect as unknown as jest.Mock;
const mockedSendFeedback = sendFeedback as jest.Mock;

describe("submitFeedback Server Action", () => {
  beforeEach(() => {
    mockedRedirect.mockClear();
    mockedSendFeedback.mockClear();
  });

  const prevState = {}; // 이전 상태 (현재 로직에서는 사용되지 않음)

  describe("Validation Failures", () => {
    it("제목이 없으면 에러 메시지를 반환해야 한다", async () => {
      const formData = new FormData();
      formData.append("title", "");
      formData.append("content", "피드백 내용입니다.");

      const result = await submitFeedback(prevState, formData);

      expect(result).toEqual({
        isError: true,
        message: "제목을 입력해주세요.",
      });
      expect(mockedSendFeedback).not.toHaveBeenCalled();
      expect(mockedRedirect).not.toHaveBeenCalled();
    });

    it("내용이 없으면 에러 메시지를 반환해야 한다", async () => {
      const formData = new FormData();
      formData.append("title", "피드백 제목입니다.");
      formData.append("content", "");

      const result = await submitFeedback(prevState, formData);

      expect(result).toEqual({
        isError: true,
        message: "내용을 입력해주세요.",
      });
      expect(mockedSendFeedback).not.toHaveBeenCalled();
      expect(mockedRedirect).not.toHaveBeenCalled();
    });
  });

  describe("API Call and Redirect", () => {
    it("sendFeedback API 호출이 실패하면 에러 메시지를 반환해야 한다", async () => {
      const errorMessage = "Network error";
      mockedSendFeedback.mockRejectedValue(new Error(errorMessage));

      const formData = new FormData();
      formData.append("title", "중요한 피드백");
      formData.append("content", "내용입니다.");

      const result = await submitFeedback(prevState, formData);

      expect(result).toEqual({
        isError: true,
        message: "알수없는 오류가 발생했습니다.",
      });
      expect(mockedRedirect).not.toHaveBeenCalled();
    });

    it("유효한 데이터 제출 시 sendFeedback을 호출하고 /feedback/thanks로 리다이렉트해야 한다", async () => {
      mockedSendFeedback.mockResolvedValue({ success: true });

      const formData = new FormData();
      formData.append("title", "피드백 제목");
      formData.append("content", "피드백 콘텐츠");
      formData.append("email", "user@example.com");

      await submitFeedback(prevState, formData);

      expect(mockedSendFeedback).toHaveBeenCalledWith(
        axiosInstance,
        "피드백 제목",
        "피드백 콘텐츠",
        "user@example.com",
      );
      expect(mockedRedirect).toHaveBeenCalledWith("/feedback/thanks");
    });
  });
});
