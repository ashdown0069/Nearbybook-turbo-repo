import FeedbackPage from "../../page";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { useActionState } from "react";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  redirect: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

// action.ts의 submitFeedback 액션 모의 처리
jest.mock("@/app/feedback/action", () => ({
  submitFeedback: jest.fn(),
}));

describe("FeedbackPage 컴포넌트", () => {
  const mockUseActionState = useActionState as jest.Mock;
  let mockAction: jest.Mock;

  beforeEach(() => {
    // 각 테스트 전에 모의 함수들 초기화
    jest.clearAllMocks();
    mockAction = jest.fn();

    // useActionState가 [state, action, isPending] 배열을 반환하도록 설정
    mockUseActionState.mockImplementation((_actionFn, initialState) => [
      initialState, // 초기 상태
      mockAction, // 모의 액션 함수
      false, // 초기 isPending 상태
    ]);
  });

  it("FeedbackPage 컴포넌트를 렌더링해야 한다", () => {
    render(<FeedbackPage />);
    expect(
      screen.getByRole("heading", { name: "피드백을 남겨주세요" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("제목")).toBeInTheDocument();
    expect(screen.getByLabelText("내용")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "피드백 제출하기" }),
    ).toBeInTheDocument();
  });

  it("버튼을 클릭했을 때 피드백 양식을 제출해야 한다", async () => {
    const user = userEvent.setup();
    render(<FeedbackPage />);
    await user.type(screen.getByLabelText("제목"), "테스트 제목");
    await user.type(screen.getByLabelText("내용"), "테스트 내용");

    await user.click(screen.getByRole("button", { name: "피드백 제출하기" }));

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("에러 발생 시 에러 메시지를 렌더링해야 한다", () => {
    const errorState = { isError: true, message: "테스트 에러 메시지" };
    // useActionState가 에러 상태를 반환하도록 재설정
    mockUseActionState.mockImplementation((_actionFn, _initialState) => [
      errorState,
      mockAction,
      false,
    ]);
    render(<FeedbackPage />);
    expect(screen.getByText("테스트 에러 메시지")).toBeInTheDocument();
  });
});
