import { useEffect, useRef, createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import type { Library } from "@repo/types";

type ActiveInfoWindowRef = {
  infoWindow: naver.maps.InfoWindow | null;
  reactRoot: Root | null;
};

interface UseMapMarkersProps {
  mapRef: React.RefObject<naver.maps.Map | null>;
  libraries: Library[];
  getMarkerIcon: (lib: Library) => string;
  getOverlayContent: (lib: Library) => React.ReactNode;
}

export function useMapMarkers({
  mapRef,
  libraries,
  getMarkerIcon,
  getOverlayContent,
}: UseMapMarkersProps) {
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const activeInfoWindow = useRef<ActiveInfoWindowRef | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 2. 새 마커 생성
    const newMarkers = libraries.map((lib) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(
          Number(lib.latitude),
          Number(lib.longitude),
        ),
        map: map,
        icon: { content: getMarkerIcon(lib) },
      });

      // 마커 클릭 이벤트
      naver.maps.Event.addListener(marker, "click", () => {
        // 기존 창 닫기
        if (activeInfoWindow.current) {
          activeInfoWindow.current.reactRoot?.unmount();
          activeInfoWindow.current.infoWindow?.close();
        }

        // 새 React 루트 생성 및 렌더링
        const contentNode = document.createElement("div");
        const infoWindow = new naver.maps.InfoWindow({
          content: contentNode,
          backgroundColor: "transparent",
          borderColor: "transparent",
          anchorSize: new naver.maps.Size(0, 0),
        });

        const root = createRoot(contentNode);
        root.render(getOverlayContent(lib));

        infoWindow.open(map, marker);
        activeInfoWindow.current = { infoWindow, reactRoot: root };
      });

      return marker;
    });

    markersRef.current = newMarkers;

    // 지도 빈 곳 클릭 시 창 닫기
    const mapClickListener = naver.maps.Event.addListener(map, "click", () => {
      if (activeInfoWindow.current) {
        activeInfoWindow.current.reactRoot?.unmount();
        activeInfoWindow.current.infoWindow?.close();
        activeInfoWindow.current = null;
      }
    });

    return () => {
      naver.maps.Event.removeListener(mapClickListener);
      // 컴포넌트 언마운트 시 마커 정리
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [mapRef, libraries, getMarkerIcon, getOverlayContent]);
}
