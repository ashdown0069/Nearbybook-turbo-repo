import { renderHook } from "@testing-library/react";
import { useMapInit } from "../useMapInit";

describe("useMapInit 훅", () => {
  const mapId = "test-map";
  
  beforeEach(() => {
    // DOM에 지도 컨테이너 추가
    document.body.innerHTML = `<div id="${mapId}"></div>`;
    jest.clearAllMocks();
  });

  it("지도를 초기화하고 설정해야 한다", () => {
    const initialCenter = { lat: 37.5, lng: 127.0 };
    renderHook(() => useMapInit({ mapId, initialCenter }));

    // naver.maps.Map 생성자 호출 확인
    expect(naver.maps.Map).toHaveBeenCalledWith(mapId, expect.objectContaining({
      zoom: 14,
      zoomControl: true,
    }));

    // LatLng 생성자 호출 확인 (초기 중심점)
    expect(naver.maps.LatLng).toHaveBeenCalledWith(initialCenter.lat, initialCenter.lng);
  });

  it("지도가 이미 로드된 상태에서 좌표가 변경되면 지도의 중심을 이동시켜야 한다", () => {
    const initialCenter = { lat: 37.5, lng: 127.0 };
    const { rerender } = renderHook(
      ({ center }) => useMapInit({ mapId, initialCenter: center }),
      {
        initialProps: { center: initialCenter },
      }
    );

    const newCenter = { lat: 38.0, lng: 128.0 };
    rerender({ center: newCenter });

    // LatLng이 새 좌표로 생성되었는지 확인
    expect(naver.maps.LatLng).toHaveBeenCalledWith(newCenter.lat, newCenter.lng);
  });

  it("지도가 초기화될 때 CustomControl(위치 버튼)을 추가해야 한다", () => {
    renderHook(() => useMapInit({ mapId }));

    expect(naver.maps.CustomControl).toHaveBeenCalled();
  });
});
