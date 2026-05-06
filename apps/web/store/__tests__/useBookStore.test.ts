import { act, renderHook } from "@testing-library/react";
import { useBook } from "../useBookStore";
import { toast } from "sonner";

// sonner 모킹
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
  },
}));

describe("useBook 스토어 훅", () => {
  const mockBook = {
    isbn: "1234567890",
    bookname: "테스트 도서",
    authors: "홍길동",
    publisher: "테스트 출판사",
  } as any;

  beforeEach(() => {
    // 로컬 스토리지 및 모킹 초기화
    localStorage.clear();
    jest.clearAllMocks();
    
    // 훅을 초기화하기 위해 스토어 상태 초기화가 필요할 수 있음
    const { result } = renderHook(() => useBook());
    act(() => {
      result.current.clearBooks();
    });
    jest.clearAllMocks();
  });

  it("초기 상태에서는 저장된 도서 목록이 비어 있어야 한다", () => {
    const { result } = renderHook(() => useBook());
    // isMounted가 true가 될 때까지 기다리지 않아도 useEffect에 의해 true가 됨
    expect(result.current.savedBooks).toEqual([]);
  });

  it("새로운 도서를 추가하면 savedBooks 목록에 반영되어야 한다", () => {
    const { result } = renderHook(() => useBook());

    act(() => {
      result.current.addBook(mockBook);
    });

    expect(result.current.savedBooks).toContainEqual(mockBook);
    expect(toast.success).toHaveBeenCalledWith("저장되었습니다.");
  });

  it("이미 존재하는 도서를 추가하려고 하면 추가되지 않고 알림을 표시해야 한다", () => {
    const { result } = renderHook(() => useBook());

    act(() => {
      result.current.addBook(mockBook);
    });
    
    act(() => {
      result.current.addBook(mockBook);
    });

    expect(result.current.savedBooks).toHaveLength(1);
    expect(toast.info).toHaveBeenCalledWith("이미 저장된 책입니다.");
  });

  it("도서 ISBN을 통해 목록에서 제거할 수 있어야 한다", () => {
    const { result } = renderHook(() => useBook());

    act(() => {
      result.current.addBook(mockBook);
    });
    
    act(() => {
      result.current.removeBook(mockBook.isbn);
    });

    expect(result.current.savedBooks).not.toContainEqual(mockBook);
    expect(toast.success).toHaveBeenCalledWith("삭제되었습니다.");
  });

  it("clearBooks 호출 시 모든 도서가 삭제되어야 한다", () => {
    const { result } = renderHook(() => useBook());

    act(() => {
      result.current.addBook(mockBook);
      result.current.addBook({ ...mockBook, isbn: "0987654321" });
    });
    
    act(() => {
      result.current.clearBooks();
    });

    expect(result.current.savedBooks).toEqual([]);
    expect(toast.success).toHaveBeenCalledWith("모든 책이 삭제되었습니다.");
  });
});
