import { useState, useEffect, useRef, useCallback } from "react";
import { useMapStore } from "@/store/useMapStore";
import { DISTRICTS_CODE_AND_NAME, SI_DO_CODE_AND_NAME } from "@/const";
import { toast } from "sonner";

export function useMapInteraction(
  mapRef: React.RefObject<naver.maps.Map | null>,
) {
  const setRegion = useMapStore((state) => state.setRegion);
  const [showSearchBtn, setShowSearchBtn] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchAgain = useCallback(() => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();
    setShowSearchBtn(false);

    if (naver && naver.maps && naver.maps.Service) {
      naver.maps.Service.reverseGeocode(
        { coords: center, orders: "legalcode" },
        (status, response) => {
          if (status !== naver.maps.Service.Status.OK) {
            toast.error("위치 정보를 가져오는 데 실패했습니다.");
            return;
          }

          const area1 = response.v2.results[0]?.region.area1.name;
          const area2 = response.v2.results[0]?.region.area2.name;

          const foundSiDo = SI_DO_CODE_AND_NAME.find(
            (sido) => sido.name === area1,
          );
          if (!foundSiDo) {
            toast.error("알 수 없는 지역입니다.");
            return;
          }

          const siGunGuList =
            DISTRICTS_CODE_AND_NAME[
              foundSiDo.name as keyof typeof DISTRICTS_CODE_AND_NAME
            ];
          const foundSiGunGu = siGunGuList.find(
            (siGunGu) => siGunGu.name === area2,
          );

          if (!foundSiGunGu) {
            toast.error("알 수 없는 지역입니다.");
            return;
          }

          setRegion(foundSiDo, foundSiGunGu);
        },
      );
    }
  }, [mapRef.current, setShowSearchBtn]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const dragendListener = naver.maps.Event.addListener(map, "dragend", () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => setShowSearchBtn(true), 500);
    });

    return () => {
      naver.maps.Event.removeListener(dragendListener);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [mapRef.current]); // map instance가 준비된 후 바인딩

  return { showSearchBtn, handleSearchAgain };
}
