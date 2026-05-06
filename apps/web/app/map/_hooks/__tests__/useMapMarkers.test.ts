import { renderHook } from "@testing-library/react";
import { useMapMarkers } from "../useMapMarkers";

describe("useMapMarkers 훅", () => {
  let mockMap: any;
  let mockAddListener: jest.Mock;
  let mockRemoveListener: jest.Mock;
  let mockMarkerInstance: any;
  let mockInfoWindowInstance: any;

  beforeAll(() => {
    // 필요한 naver maps 객체 추가 모킹
    naver.maps.Size = jest.fn().mockImplementation((w, h) => ({ w, h }));
    naver.maps.Point = jest.fn().mockImplementation((x, y) => ({ x, y }));
    naver.maps.LatLngBounds = jest.fn().mockImplementation((sw, ne) => ({
      extend: jest.fn(),
      hasLatLng: jest.fn().mockReturnValue(true),
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockAddListener = jest.fn((target, eventName, callback) => {
      // 리스너 반환 객체 모킹
      return { target, eventName, callback };
    });
    mockRemoveListener = jest.fn();
    naver.maps.Event.addListener = mockAddListener;
    naver.maps.Event.removeListener = mockRemoveListener;

    mockMarkerInstance = {
      setMap: jest.fn(),
      getPosition: jest.fn().mockReturnValue({ lat: () => 37.5, lng: () => 127.0 }),
    };

    mockInfoWindowInstance = {
      open: jest.fn(),
      close: jest.fn(),
      setContent: jest.fn(),
    };

    (naver.maps.Marker as jest.Mock).mockImplementation(() => mockMarkerInstance);
    (naver.maps.InfoWindow as jest.Mock).mockImplementation(() => mockInfoWindowInstance);

    mockMap = {
      setCenter: jest.fn(),
      getZoom: jest.fn().mockReturnValue(12),
      setZoom: jest.fn(),
      getBounds: jest.fn().mockReturnValue(new naver.maps.LatLngBounds()),
      getProjection: jest.fn().mockReturnValue({
        fromCoordToOffset: jest.fn((latlng: any) => ({ x: latlng.lat() * 100, y: latlng.lng() * 100 }))
      }),
      fitBounds: jest.fn(),
    };
  });

  const getMockProps = () => ({
    mapRef: { current: mockMap },
    libraries: [] as any[],
    getMarkerIcon: jest.fn().mockReturnValue("icon-url"),
    getOverlayContent: jest.fn().mockReturnValue("overlay-content"),
  });

  it("도서관 데이터를 기반으로 마커를 생성해야 한다", () => {
    const libraries = [
      { libName: "도서관1", latitude: 37.5, longitude: 127.0, hasBook: true },
      { libName: "도서관2", latitude: 37.6, longitude: 127.1, hasBook: false },
    ] as any[];

    renderHook(() => useMapMarkers({ ...getMockProps(), libraries }));

    // naver.maps.Marker 생성자 호출 확인
    expect(naver.maps.Marker).toHaveBeenCalledTimes(2);
    // LatLng 호출 확인
    expect(naver.maps.LatLng).toHaveBeenCalledWith(37.5, 127.0);
    expect(naver.maps.LatLng).toHaveBeenCalledWith(37.6, 127.1);
  });

  it("지도 객체가 없으면 마커를 생성하지 않아야 한다", () => {
    renderHook(() => useMapMarkers({ ...getMockProps(), mapRef: { current: null } }));

    expect(naver.maps.Marker).not.toHaveBeenCalled();
  });

  it("마커 클릭 시 InfoWindow가 열리고, 지도를 클릭하면 닫혀야 한다", () => {
    const libraries = [{ libName: "도서관1", latitude: 37.5, longitude: 127.0, hasBook: true }] as any[];
    
    renderHook(() => useMapMarkers({ ...getMockProps(), libraries }));

    const markerClickCall = mockAddListener.mock.calls.find(call => call[1] === "click" && call[0] !== mockMap);
    const clickCallback = markerClickCall[2];
    
    // 마커 클릭 - InfoWindow 생성
    clickCallback();
    expect(naver.maps.InfoWindow).toHaveBeenCalled();
    expect(mockInfoWindowInstance.open).toHaveBeenCalled();

    // 두 번째 클릭 시 기존 InfoWindow 닫힘 검증
    clickCallback();
    expect(mockInfoWindowInstance.close).toHaveBeenCalled();

    // 지도 클릭 리스너 찾아서 호출 (빈 곳 클릭하여 닫기)
    const mapClickCall = mockAddListener.mock.calls.find(call => call[1] === "click" && call[0] === mockMap);
    const mapClickCallback = mapClickCall[2];
    mapClickCallback();
    expect(mockInfoWindowInstance.close).toHaveBeenCalledTimes(2);
  });

  it("enableClustering 옵션이 true일 때 클러스터링 로직이 실행되어야 한다", () => {
    const libraries = [
      { libName: "도서관1", latitude: 37.5, longitude: 127.0, hasBook: true },
      { libName: "도서관2", latitude: 37.5, longitude: 127.0, hasBook: false },
    ] as any[];

    renderHook(() => useMapMarkers({ ...getMockProps(), libraries, enableClustering: true }));

    const idleCall = mockAddListener.mock.calls.find(call => call[1] === "idle");
    expect(idleCall).toBeDefined();

    // 개별 마커 2개 + 클러스터 마커 1개
    expect(naver.maps.Marker).toHaveBeenCalledTimes(3); 
  });
  
  it("enableClustering 시 zoom이 MAX_ZOOM 이상이면 개별 마커가 표시되어야 한다", () => {
    mockMap.getZoom.mockReturnValue(15); // MAX_ZOOM(14) 이상
    const libraries = [
      { libName: "도서관1", latitude: 37.5, longitude: 127.0, hasBook: true },
      { libName: "도서관2", latitude: 37.5, longitude: 127.0, hasBook: false },
    ] as any[];

    renderHook(() => useMapMarkers({ ...getMockProps(), libraries, enableClustering: true }));

    // 개별 마커 2개만 생성됨 (클러스터 마커 미생성)
    expect(naver.maps.Marker).toHaveBeenCalledTimes(2);
  });
  
  it("클러스터 사이즈별 아이콘이 생성되어야 한다", () => {
    // 10개, 30개 등 클러스터 분기 테스트를 위해 35개 마커 생성
    const libraries = Array.from({ length: 35 }, (_, i) => ({
      libName: `도서관${i}`, latitude: 37.5, longitude: 127.0, hasBook: true
    })) as any[];

    renderHook(() => useMapMarkers({ ...getMockProps(), libraries, enableClustering: true }));

    // 클러스터 60px 분기 테스트 등
    const clusterMarkerCall = (naver.maps.Marker as jest.Mock).mock.calls.find(call => call[0].icon && call[0].icon.content && call[0].icon.content.includes("60px"));
    expect(clusterMarkerCall).toBeDefined();
  });

  it("클러스터 마커 클릭 시 fitBounds가 호출되어야 한다", () => {
    mockMap.getZoom.mockReturnValue(12);
    const libraries = Array.from({ length: 15 }, (_, i) => ({
      libName: `도서관${i}`, latitude: 37.5, longitude: 127.0, hasBook: true
    })) as any[];

    renderHook(() => useMapMarkers({ ...getMockProps(), libraries, enableClustering: true }));

    const markerClickCalls = mockAddListener.mock.calls.filter(call => call[1] === "click" && call[0] !== mockMap);
    const clusterClickCallback = markerClickCalls[markerClickCalls.length - 1][2];
    
    clusterClickCallback();
    expect(mockMap.fitBounds).toHaveBeenCalled();
    expect(mockMap.setZoom).toHaveBeenCalledWith(11); // 줌을 1단계 낮춤
  });

  it("언마운트 시 등록된 리스너와 마커들이 제거되어야 한다", () => {
    const libraries = [{ libName: "도서관1", latitude: 37.5, longitude: 127.0, hasBook: true }] as any[];
    
    const { unmount } = renderHook(() => useMapMarkers({ ...getMockProps(), libraries, enableClustering: true }));
    
    unmount();
    
    expect(mockRemoveListener).toHaveBeenCalled();
    expect(mockMarkerInstance.setMap).toHaveBeenCalledWith(null);
  });
});
