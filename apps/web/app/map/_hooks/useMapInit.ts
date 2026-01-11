import { useEffect, useRef, useState } from "react";
import { LOCATION_BTN_HTML } from "@/app/map/_etc/constants";

interface UseMapInitProps {
  mapId: string;
  initialCenter?: { lat?: number; lng?: number };
}

export function useMapInit({ mapId, initialCenter }: UseMapInitProps) {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const mapElement = document.getElementById(mapId);
    if (!mapElement || mapRef.current) return;

    const center = new naver.maps.LatLng(
      initialCenter?.lat || 37.5642135,
      initialCenter?.lng || 127.0016985,
    );

    const map = new naver.maps.Map(mapId, {
      center,
      zoom: 14,
      scaleControl: false,
      logoControl: false,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_LEFT,
      },
    });
    map.setCenter(center);

    mapRef.current = map;

    const customControl = new naver.maps.CustomControl(LOCATION_BTN_HTML, {
      position: naver.maps.Position.RIGHT_BOTTOM,
    });

    const initListener = naver.maps.Event.once(map, "init", () => {
      customControl.setMap(map);
      const customControlElement = customControl.getElement();
      naver.maps.Event.addDOMListener(customControlElement, "click", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newCenter = new naver.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude,
              );
              map.setCenter(newCenter);
            },
            (error) => {
              console.error("Geolocation error:", error);
              map.setCenter(center);
            },
          );
        } else {
          map.setCenter(center);
        }
      });
      setIsMapLoaded(true);
    });

    return () => {
      naver.maps.Event.removeListener(initListener);
    };
  }, [mapId, initialCenter?.lat, initialCenter?.lng]);

  // 2. 좌표 변경 감지 및 지도 이동 로직 (추가됨)
  useEffect(() => {
    // 지도가 로드되어 있고, 유효한 좌표가 들어왔을 때 중심 이동
    if (mapRef.current && initialCenter?.lat && initialCenter?.lng) {
      const newCenter = new naver.maps.LatLng(
        initialCenter.lat,
        initialCenter.lng,
      );
      mapRef.current.setCenter(newCenter); // 또는 mapRef.current.morph(newCenter) 사용 가능
    }
  }, [initialCenter?.lat, initialCenter?.lng]);

  return { mapRef, isMapLoaded };
}
