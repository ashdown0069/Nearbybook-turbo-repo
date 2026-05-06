import { act, renderHook } from "@testing-library/react";
import { useBookInfoStore } from "../useBookInfoStore";

describe("useBookInfoStore 스토어", () => {
  const isbn = "1234567890";
  const libCode = "111001";
  const key = `${isbn}-${libCode}`;

  beforeEach(() => {
    act(() => {
      // 스토어 상태 초기화
      useBookInfoStore.setState({ entries: {} });
    });
  });

  it("초기 상태는 비어 있어야 한다", () => {
    const { result } = renderHook(() => useBookInfoStore());
    expect(result.current.entries).toEqual({});
  });

  it("대출 상태(loanStatus)를 업데이트할 수 있어야 한다", () => {
    const { result } = renderHook(() => useBookInfoStore());

    act(() => {
      result.current.setLoanStatus(isbn, libCode, "canLoan");
    });

    expect(result.current.entries[key].loanStatus).toBe("canLoan");
  });

  it("도서 위치 정보(location)를 업데이트할 수 있어야 한다", () => {
    const { result } = renderHook(() => useBookInfoStore());
    const location = { shelfLocation: "2층 일반실", bookCode: "813.6-ㅇ-12" };

    act(() => {
      result.current.setLocation(isbn, libCode, location);
    });

    expect(result.current.entries[key].location).toEqual(location);
  });

  it("위치 정보 로딩 상태(locationLoading)를 업데이트할 수 있어야 한다", () => {
    const { result } = renderHook(() => useBookInfoStore());

    act(() => {
      result.current.setLocationLoading(isbn, libCode, true);
    });

    expect(result.current.entries[key].locationLoading).toBe(true);

    act(() => {
      result.current.setLocationLoading(isbn, libCode, false);
    });

    expect(result.current.entries[key].locationLoading).toBe(false);
  });

  it("존재하지 않는 엔트리에 대해 업데이트할 때 기본값을 바탕으로 생성되어야 한다", () => {
    const { result } = renderHook(() => useBookInfoStore());

    act(() => {
      result.current.setLoanStatus(isbn, libCode, "loading");
    });

    const entry = result.current.entries[key];
    expect(entry.loanStatus).toBe("loading");
    expect(entry.location).toBeNull();
    expect(entry.locationLoading).toBe(false);
  });
});
