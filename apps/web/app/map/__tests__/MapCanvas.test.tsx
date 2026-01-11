import { render, screen, fireEvent } from "@testing-library/react";
import MapCanvas from "../_components/MapCanvas";
import { useMapInit } from "@/app/map/_hooks/useMapInit";
import { useMapMarkers } from "@/app/map/_hooks/useMapMarkers";
import { useMapInteraction } from "@/app/map/_hooks/useMapInteraction";
import { useMapStore } from "@/store/useMapStore";
import { Library } from "@repo/types";

// Mock custom hooks
jest.mock("@/app/map/_hooks/useMapInit");
jest.mock("@/app/map/_hooks/useMapMarkers");
jest.mock("@/app/map/_hooks/useMapInteraction");
jest.mock("@/store/useMapStore");

// Mock dynamic import
jest.mock("next/dynamic", () => () => {
  const DynamicComponent = () => <div data-testid="map-overlay-content">MapOverlayContent</div>;
  DynamicComponent.displayName = "LoadableComponent";
  return DynamicComponent;
});

describe("MapCanvas", () => {
  const mockMapRef = { current: "mock-map-instance" };
  const mockHandleSearchAgain = jest.fn();
  const mockLibraryList: Library[] = [
    {
      libCode: "1",
      libName: "Test Lib",
      address: "Test Address",
      tel: "000-0000",
      latitude: "37.1",
      longitude: "127.1",
      homepage: "http://test.com",
      closed: "Mon",
      operatingTime: "09:00-18:00",
      hasBook: true,
    },
  ];
  const mockIsbn = "1234567890";

  beforeEach(() => {
    jest.clearAllMocks();

    (useMapInit as jest.Mock).mockReturnValue({ mapRef: mockMapRef });
    (useMapMarkers as jest.Mock).mockReturnValue({});
    (useMapInteraction as jest.Mock).mockReturnValue({
      showSearchBtn: false,
      handleSearchAgain: mockHandleSearchAgain,
    });
    
    (useMapStore as unknown as jest.Mock).mockReturnValue({
      myLat: 37.5665,
      myLng: 126.978,
      region: { name: "서울특별시" },
      dtl_region: { name: "중구" },
    });
  });

  it("renders the map container", () => {
    // This test checks if the container with id "map" is rendered.
    // Note: Since id="map" is on the root div of the component,
    // we can use container.firstChild or verify by ID.
    const { container } = render(
      <MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />
    );
    // Ideally we want to check if the div with id="map" exists.
    // However, react-testing-library queries usually look for role or text.
    // We can check attributes of the container's first child.
    expect(container.firstChild).toHaveAttribute("id", "map");
    expect(container.firstChild).toHaveClass("relative h-full w-full md:w-2/3");
  });

  it("initializes the map with correct coordinates", () => {
    render(
      <MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />
    );

    expect(useMapInit).toHaveBeenCalledWith({
      mapId: "map",
      initialCenter: { lat: 37.5665, lng: 126.978 },
    });
  });

  it("calls useMapMarkers with correct arguments", () => {
    render(
      <MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />
    );

    expect(useMapMarkers).toHaveBeenCalledWith(
        expect.objectContaining({
            mapRef: mockMapRef,
            libraries: mockLibraryList,
        })
    );
  });


  it("renders region info when region data exists", () => {
    render(
      <MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />
    );

    expect(screen.getByText("서울특별시 중구")).toBeInTheDocument();
  });

  it("does not render region info when region data is missing", () => {
    (useMapStore as unknown as jest.Mock).mockReturnValue({
      myLat: 37.5665,
      myLng: 126.978,
      region: undefined,
      dtl_region: undefined,
    });

    render(
      <MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />
    );

    expect(screen.queryByText(/서울특별시/)).not.toBeInTheDocument();
  });

  it("renders 'Search Again' button when showSearchBtn is true", () => {
    (useMapInteraction as jest.Mock).mockReturnValue({
      showSearchBtn: true,
      handleSearchAgain: mockHandleSearchAgain,
    });

    render(
      <MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />
    );

    const button = screen.getByRole("button", { name: /다시 검색하기/i });
    expect(button).toBeInTheDocument();
  });

  it("calls handleSearchAgain when 'Search Again' button is clicked", () => {
    (useMapInteraction as jest.Mock).mockReturnValue({
      showSearchBtn: true,
      handleSearchAgain: mockHandleSearchAgain,
    });

    render(
      <MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />
    );

    const button = screen.getByRole("button", { name: /다시 검색하기/i });
    fireEvent.click(button);

    expect(mockHandleSearchAgain).toHaveBeenCalledTimes(1);
  });
});