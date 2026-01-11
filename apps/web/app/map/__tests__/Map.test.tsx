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

describe("Map Component", () => {
  const mockRefetchLibs = jest.fn();
  const mockRefetchBook = jest.fn();

  // Common props for the Map component
  const defaultProps = {
    isbn: "1234567890",
    region: "test-region",
    dtlRegion: "test-dtl-region",
  };
  
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation for useMapStore state
    (useMapStore as unknown as jest.Mock).mockReturnValue({
      region: { code: "123" },
      dtl_region: { code: "456" },
      status: "idle",
      myLat: 37.5,
      myLng: 127.0,
    });
  });

  it("renders LoadingScreen when data is loading", () => {
    // Mock hooks to return loading state
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

  it("renders ErrorScreen when there is an error in libraries fetching", () => {
    // Mock hooks to return error state
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

  it("renders ErrorScreen when there is an error in book fetching", () => {
      // Mock hooks to return error state
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

  it("calls refetch functions when ErrorScreen is clicked", () => {
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
    
    // Both refetch functions should be called
    expect(mockRefetchLibs).toHaveBeenCalled();
    expect(mockRefetchBook).toHaveBeenCalled();
  });

  it("renders MapSidebar and MapCanvas when data is successfully loaded", () => {
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

  it("shows toast warning when no libraries have the book", () => {
    // Mock data where hasBook is false for all libraries
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
    // Verify toast warning is called with specific message
    expect(toast.warning).toHaveBeenCalledWith("검색 결과가 없습니다.");
  });

  it("does not render main content if location data (myLat/myLng) is missing", () => {
     (useMapStore as unknown as jest.Mock).mockReturnValue({
        region: { code: "123" },
        dtl_region: { code: "456" },
        status: "idle",
        myLat: undefined, // Missing location
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