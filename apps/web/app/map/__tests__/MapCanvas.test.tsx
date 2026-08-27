import { render, screen, fireEvent } from "@testing-library/react"
import MapCanvas from "../_components/MapCanvas"
import { useMapInit } from "@/app/map/_hooks/useMapInit"
import { useMapMarkers } from "@/app/map/_hooks/useMapMarkers"
import { useMapInteraction } from "@/app/map/_hooks/useMapInteraction"
import { useMapStore } from "@/store/useMapStore"
import { Library } from "@workspace/types"

// Mock custom hooks
jest.mock("@/app/map/_hooks/useMapInit")
jest.mock("@/app/map/_hooks/useMapMarkers")
jest.mock("@/app/map/_hooks/useMapInteraction")
jest.mock("@/store/useMapStore")

// Mock dynamic import
jest.mock("next/dynamic", () => () => {
  const DynamicComponent = () => (
    <div data-testid="map-overlay-content">MapOverlayContent</div>
  )
  DynamicComponent.displayName = "LoadableComponent"
  return DynamicComponent
})

describe("MapCanvas 컴포넌트", () => {
  const mockMapInstance = {
    setCenter: jest.fn(),
  }
  const mockMapRef = { current: mockMapInstance }
  const mockHandleSearchAgain = jest.fn()
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
  ]
  const mockIsbn = "1234567890"

  const mockMarkerSetMap = jest.fn()
  const mockMarkerSetPosition = jest.fn()

  beforeAll(() => {
    // Naver Maps Global Mocking
    ;(global as any).naver = {
      maps: {
        LatLng: jest.fn().mockImplementation((lat, lng) => ({ lat, lng })),
        Point: jest.fn().mockImplementation((x, y) => ({ x, y })),
        Marker: jest.fn().mockImplementation(() => ({
          setMap: mockMarkerSetMap,
          setPosition: mockMarkerSetPosition,
        })),
      },
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()

    ;(useMapInit as jest.Mock).mockReturnValue({ mapRef: mockMapRef })
    ;(useMapMarkers as jest.Mock).mockReturnValue({})
    ;(useMapInteraction as jest.Mock).mockReturnValue({
      showSearchBtn: false,
      handleSearchAgain: mockHandleSearchAgain,
    })

    ;(useMapStore as unknown as jest.Mock).mockReturnValue({
      myLat: 37.5665,
      myLng: 126.978,
      region: { name: "서울특별시" },
      dtl_region: { name: "중구" },
      isLocationAllowed: true,
    })
  })

  it("지도 컨테이너를 렌더링해야 한다", () => {
    // This test checks if the container with id "map" is rendered.
    // Note: Since id="map" is on the root div of the component,
    // we can use container.firstChild or verify by ID.
    const { container } = render(
      <MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />
    )
    // Ideally we want to check if the div with id="map" exists.
    // However, react-testing-library queries usually look for role or text.
    // We can check attributes of the container's first child.
    expect(container.firstChild).toHaveAttribute("id", "map")
    expect(container.firstChild).toHaveClass("relative h-full w-full md:w-2/3")
  })

  it("올바른 좌표로 지도를 초기화해야 한다", () => {
    render(<MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />)

    expect(useMapInit).toHaveBeenCalledWith({
      mapId: "map",
      initialCenter: { lat: 37.5665, lng: 126.978 },
    })
  })

  it("올바른 인자로 useMapMarkers를 호출해야 한다", () => {
    render(<MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />)

    expect(useMapMarkers).toHaveBeenCalledWith(
      expect.objectContaining({
        mapRef: mockMapRef,
        libraries: mockLibraryList,
      })
    )
  })

  it("지역 데이터가 존재할 때 지역 정보를 렌더링해야 한다", () => {
    render(<MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />)

    expect(screen.getByText("서울특별시 중구")).toBeInTheDocument()
  })

  it("지역 데이터가 없을 때 지역 정보를 렌더링하지 않아야 한다", () => {
    ;(useMapStore as unknown as jest.Mock).mockReturnValue({
      myLat: 37.5665,
      myLng: 126.978,
      region: undefined,
      dtl_region: undefined,
    })

    render(<MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />)

    expect(screen.queryByText(/서울특별시/)).not.toBeInTheDocument()
  })

  it("showSearchBtn이 true일 때 '다시 검색하기' 버튼을 렌더링해야 한다", () => {
    ;(useMapInteraction as jest.Mock).mockReturnValue({
      showSearchBtn: true,
      handleSearchAgain: mockHandleSearchAgain,
    })

    render(<MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />)

    const button = screen.getByRole("button", { name: /다시 검색하기/i })
    expect(button).toBeInTheDocument()
  })

  it("'다시 검색하기' 버튼을 클릭했을 때 handleSearchAgain을 호출해야 한다", () => {
    ;(useMapInteraction as jest.Mock).mockReturnValue({
      showSearchBtn: true,
      handleSearchAgain: mockHandleSearchAgain,
    })

    render(<MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />)

    const button = screen.getByRole("button", { name: /다시 검색하기/i })
    fireEvent.click(button)

    expect(mockHandleSearchAgain).toHaveBeenCalledTimes(1)
  })

  it("isLocationAllowed가 true일 때 내 위치 파란 점 마커를 생성해야 한다", () => {
    render(<MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />)

    expect(global.naver.maps.Marker).toHaveBeenCalledWith(
      expect.objectContaining({
        position: expect.any(Object),
        map: mockMapInstance,
        zIndex: 100,
      })
    )
  })

  it("isLocationAllowed가 false일 때 내 위치 마커를 생성하지 않아야 한다", () => {
    ;(useMapStore as unknown as jest.Mock).mockReturnValue({
      myLat: 37.5665,
      myLng: 126.978,
      region: { name: "서울특별시" },
      dtl_region: { name: "중구" },
      isLocationAllowed: false,
    })

    render(<MapCanvas libraryList={mockLibraryList} isbn={mockIsbn} />)

    expect(global.naver.maps.Marker).not.toHaveBeenCalled()
  })
})
