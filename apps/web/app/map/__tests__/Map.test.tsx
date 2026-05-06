import { render, screen, fireEvent } from "@testing-library/react";
import Map from "../_components/Map";
import { useMapStore } from "@/store/useMapStore";
import { useGetLibsByISBN, useSearchBook } from "@repo/data-access";
import { toast } from "sonner";

// Mock child components to isolate Map component logic
jest.mock("../_components/MapSidebar", () => () => <div data-testid="map-sidebar">MapSidebar</div>);
jest.mock("../_components/MapCanvas", () => () => <div data-testid="map-canvas">MapCanvas</div>);
jest.mock("@/components/Loading", () => () => <div data-testid="loading-screen">LoadingScreen</div>);
jest.mock("@/components/Error", () => ({ resetErrorBoundary }: { resetErrorBoundary: () => void }) => (
  <button data-testid="error-screen" onClick={resetErrorBoundary}>
    ErrorScreen
  </button>
));

// Mock hooks and external libraries
jest.mock("@/store/useMapStore", () => ({
  useMapStore: jest.fn(),
}));
jest.mock("@repo/data-access");
jest.mock("../_hooks/useUserRegion", () => ({
  useUserRegion: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: {
    warning: jest.fn(),
  },
}));
// Mock axiosInstance to prevent actual network calls or import errors
jest.mock("@/lib/axios", () => ({
    axiosInstance: {}
}));

describe("Map 컴포넌트", () => {
  const mockRefetchLibs = jest.fn();
  const mockRefetchBook = jest.fn();

  // Map 컴포넌트의 공통 Props
  const defaultProps = {
    isbn: "1234567890",
    region: "test-region",
    dtlRegion: "test-dtl-region",
  };
  
  beforeEach(() => {
    jest.clearAllMocks();

    // useMapStore 상태의 기본 모킹 구현
    (useMapStore as unknown as jest.Mock).mockReturnValue({
      region: { code: "123" },
      dtl_region: { code: "456" },
      status: "idle",
      myLat: 37.5,
      myLng: 127.0,
    });
  });

  it("데이터 로딩 중일 때 로딩 화면을 렌더링해야 한다", () => {
    // 로딩 상태를 반환하도록 훅 모킹
    (useGetLibsByISBN as jest.Mock).mockReturnValue({
      isLoading: true,
      data: null,
      isError: false,
    });
    (useSearchBook as jest.Mock).mockReturnValue({
        isLoading: false,
        data: null,
        isError: false,
    });

    render(<Map {...defaultProps} />);
    expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
  });

  it("도서관 정보를 가져오는 중 에러가 발생하면 에러 화면을 렌더링해야 한다", () => {
    // 에러 상태를 반환하도록 훅 모킹
    (useGetLibsByISBN as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      refetch: mockRefetchLibs,
    });
    (useSearchBook as jest.Mock).mockReturnValue({
        isLoading: false,
        isError: false,
        refetch: mockRefetchBook,
    });

    render(<Map {...defaultProps} />);
    expect(screen.getByTestId("error-screen")).toBeInTheDocument();
  });

  it("도서 정보를 가져오는 중 에러가 발생하면 에러 화면을 렌더링해야 한다", () => {
      // 에러 상태를 반환하도록 훅 모킹
      (useGetLibsByISBN as jest.Mock).mockReturnValue({
        isLoading: false,
        isError: false,
        refetch: mockRefetchLibs,
      });
      (useSearchBook as jest.Mock).mockReturnValue({
          isLoading: false,
          isError: true,
          refetch: mockRefetchBook,
      });
  
      render(<Map {...defaultProps} />);
      expect(screen.getByTestId("error-screen")).toBeInTheDocument();
    });

  it("에러 화면 클릭 시 refetch 함수들을 호출해야 한다", () => {
    (useGetLibsByISBN as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      refetch: mockRefetchLibs,
    });
     (useSearchBook as jest.Mock).mockReturnValue({
        isLoading: false,
        isError: true,
        refetch: mockRefetchBook,
    });

    render(<Map {...defaultProps} />);
    fireEvent.click(screen.getByTestId("error-screen"));
    
    // 두 refetch 함수 모두 호출되어야 함
    expect(mockRefetchLibs).toHaveBeenCalled();
    expect(mockRefetchBook).toHaveBeenCalled();
  });

  it("데이터가 성공적으로 로드되면 MapSidebar와 MapCanvas를 렌더링해야 한다", () => {
    (useGetLibsByISBN as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [{ hasBook: true }],
      isError: false,
    });
    (useSearchBook as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { title: "Test Book" },
      isError: false,
    });

    render(<Map {...defaultProps} />);
    expect(screen.getByTestId("map-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("map-canvas")).toBeInTheDocument();
  });

  it("도서를 보유한 도서관이 없으면 경고 토스트를 표시해야 한다", () => {
    // 모든 도서관이 도서를 보유하지 않은 상태로 모킹
     (useGetLibsByISBN as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [{ hasBook: false }, { hasBook: false }],
      isError: false,
    });
    (useSearchBook as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { title: "Test Book" },
      isError: false,
    });

    render(<Map {...defaultProps} />);
    // 특정 메시지와 함께 토스트 경고가 호출되었는지 확인
    expect(toast.warning).toHaveBeenCalledWith("검색 결과가 없습니다.");
  });

  it("위치 정보(myLat/myLng)가 없으면 주요 컨텐츠를 렌더링하지 않아야 한다", () => {
     (useMapStore as unknown as jest.Mock).mockReturnValue({
        region: { code: "123" },
        dtl_region: { code: "456" },
        status: "idle",
        myLat: undefined, // 위치 정보 누락
        myLng: undefined,
      });

    (useGetLibsByISBN as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [{ hasBook: true }],
      isError: false,
    });
    (useSearchBook as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { title: "Test Book" },
      isError: false,
    });

    render(<Map {...defaultProps} />);
    expect(screen.queryByTestId("map-sidebar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("map-canvas")).not.toBeInTheDocument();
  });
});