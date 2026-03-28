import { useEffect, useRef } from "react";
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
  enableClustering?: boolean;
}

function makeClusterIcon(size: number, bg: string, fontSize: number): string {
  return `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:50%;background:${bg};opacity:0.85;color:#fff;font-weight:bold;font-size:${fontSize}px;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;"><span>{count}</span></div>`;
}

function getClusterIconHtml(count: number): string {
  if (count >= 30) return makeClusterIcon(60, "oklch(50% 0.219 149.579)", 16);
  if (count >= 10) return makeClusterIcon(50, "oklch(60% 0.219 149.579)", 14);
  return makeClusterIcon(40, "oklch(72.3% 0.219 149.579)", 13);
}

function getClusterSize(count: number): number {
  if (count >= 30) return 60;
  if (count >= 10) return 50;
  return 40;
}

export function useMapMarkers({
  mapRef,
  libraries,
  getMarkerIcon,
  getOverlayContent,
  enableClustering = false,
}: UseMapMarkersProps) {
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const clusterMarkersRef = useRef<naver.maps.Marker[]>([]);
  const activeInfoWindow = useRef<ActiveInfoWindowRef | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 기존 클러스터 마커 제거
    clusterMarkersRef.current.forEach((marker) => marker.setMap(null));
    clusterMarkersRef.current = [];

    // 2. 새 마커 생성
    const newMarkers = libraries.map((lib) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(
          Number(lib.latitude),
          Number(lib.longitude),
        ),
        map: enableClustering ? undefined : map,
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

    // --- 클러스터링 로직 (enableClustering=true일 때만) ---
    const clusterListeners: naver.maps.MapEventListener[] = [];

    if (enableClustering) {
      const GRID_SIZE = 120;
      const MAX_ZOOM = 14;
      let prevShowingIndividual = false;
      let debounceTimer: ReturnType<typeof setTimeout> | null = null;

      const updateClusters = () => {
        const zoom = map.getZoom();
        const showIndividual = zoom >= MAX_ZOOM;

        // 개별 표시 모드: 이미 개별 표시 중이면 skip (불필요한 setMap 반복 방지)
        if (showIndividual) {
          if (!prevShowingIndividual) {
            clusterMarkersRef.current.forEach((m) => m.setMap(null));
            clusterMarkersRef.current = [];
            newMarkers.forEach((m) => m.setMap(map));
            prevShowingIndividual = true;
          }
          return;
        }

        prevShowingIndividual = false;

        // 기존 클러스터 마커 제거
        clusterMarkersRef.current.forEach((m) => m.setMap(null));
        clusterMarkersRef.current = [];

        // 모든 개별 마커 숨김
        newMarkers.forEach((m) => m.setMap(null));

        // 그리드 기반 클러스터 계산
        const bounds = map.getBounds() as naver.maps.LatLngBounds;
        const projection = map.getProjection();
        const gridMap = new Map<string, naver.maps.Marker[]>();

        for (const marker of newMarkers) {
          const position = marker.getPosition() as naver.maps.LatLng;
          if (!bounds.hasLatLng(position)) continue;

          const pixel = projection.fromCoordToOffset(position);
          const key = `${Math.floor(pixel.x / GRID_SIZE)}_${Math.floor(pixel.y / GRID_SIZE)}`;

          if (!gridMap.has(key)) gridMap.set(key, []);
          gridMap.get(key)!.push(marker);
        }

        // 각 그리드 셀 처리
        for (const [, markers] of gridMap) {
          if (markers.length < 2) {
            markers.forEach((m) => m.setMap(map));
          } else {
            let totalLat = 0;
            let totalLng = 0;
            for (const m of markers) {
              const pos = m.getPosition() as naver.maps.LatLng;
              totalLat += pos.lat();
              totalLng += pos.lng();
            }

            const count = markers.length;
            const size = getClusterSize(count);

            const clusterMarker = new naver.maps.Marker({
              position: new naver.maps.LatLng(
                totalLat / count,
                totalLng / count,
              ),
              map: map,
              icon: {
                content: getClusterIconHtml(count).replace(
                  "{count}",
                  String(count),
                ),
                size: new naver.maps.Size(size, size),
                anchor: new naver.maps.Point(size / 2, size / 2),
              },
            });

            naver.maps.Event.addListener(clusterMarker, "click", () => {
              const clusterBounds = new naver.maps.LatLngBounds(
                markers[0].getPosition() as naver.maps.LatLng,
                markers[0].getPosition() as naver.maps.LatLng,
              );
              for (const m of markers) {
                clusterBounds.extend(m.getPosition() as naver.maps.LatLng);
              }
              map.fitBounds(clusterBounds, {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50,
              });
              // fitBounds 후 줌을 1단계 낮춰서 여유 있게 표시
              const fitted = map.getZoom();
              if (fitted > 2) map.setZoom(fitted - 1);
            });

            clusterMarkersRef.current.push(clusterMarker);
          }
        }
      };

      const debouncedUpdate = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateClusters, 100);
      };

      updateClusters();

      // idle만 사용 (zoom_changed + idle 이중 호출 방지)
      clusterListeners.push(
        naver.maps.Event.addListener(map, "idle", debouncedUpdate),
      );
    }

    return () => {
      naver.maps.Event.removeListener(mapClickListener);
      clusterListeners.forEach((l) => naver.maps.Event.removeListener(l));
      clusterMarkersRef.current.forEach((m) => m.setMap(null));
      clusterMarkersRef.current = [];
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [mapRef, libraries, getMarkerIcon, getOverlayContent, enableClustering]);
}
