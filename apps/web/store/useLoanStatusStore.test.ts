import { act } from "@testing-library/react";
import { useLoanStatusStore } from "./useLoanStatusStore";

// 스토어의 초기 상태를 가져옵니다.
const initialState = useLoanStatusStore.getState();

describe("useLoanStatusStore", () => {
  // 각 테스트가 실행되기 전에 스토어의 상태를 초기 상태로 리셋합니다.
  beforeEach(() => {
    useLoanStatusStore.setState(initialState);
  });

  it("should initialize with empty state", () => {
    const state = useLoanStatusStore.getState();
    expect(state.statuses).toEqual({});
  });

  it("should set status correctly", () => {
    act(() => {
      useLoanStatusStore
        .getState()
        .setLoanStatus("1234567891011", "123", "canLoan");
    });
    expect(useLoanStatusStore.getState().statuses["1234567891011-123"]).toBe(
      "canLoan",
    );
  });
});
