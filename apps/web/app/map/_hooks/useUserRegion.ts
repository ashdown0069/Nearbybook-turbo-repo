"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useMapStore } from "@/store/useMapStore";
import { DISTRICTS_CODE_AND_NAME, SI_DO_CODE_AND_NAME } from "@/const";
import type { Region } from "@/types/type";
import { getRegionCookie, setRegionCookie } from "@/lib/MapCookie";
import { useShallow } from "zustand/shallow";

const DEFAULT_REGION = { code: "11", name: "서울특별시" };
const DEFAULT_DISTRICT = { code: "11010", name: "종로구" };

export function useUserRegion({
  region: regionProp,
  dtlRegion: detailRegionProp,
}: Partial<Region>) {
  const { setRegion, setStatus, setMyPosition } = useMapStore(
    useShallow((state) => ({
      setRegion: state.setRegion,
      setStatus: state.setStatus,
      setMyPosition: state.setMyPosition,
    })),
  );

  const updateRegionAndCookie = (
    siDo: { code: string; name: string },
    siGunGu: { code: string; name: string },
  ) => {
    setRegion(siDo, siGunGu);

    setRegionCookie({
      region: siDo.code,
      dtlRegion: siGunGu.code,
    });
  };

  const setFallbackLocation = (msg?: string) => {
    if (msg) {
      toast.error(msg, {
        style: { fontSize: "16px" },
        duration: 5000,
        descriptionClassName: "text-sm py-3",
        description: "브라우저의 위치 정보 권한을 확인해주세요.",
      });
    }
    setRegion(DEFAULT_REGION, DEFAULT_DISTRICT);
    setStatus("success");
  };

  useEffect(() => {
    // 1. URL 파라미터 로직
    if (regionProp && detailRegionProp) {
      const region = SI_DO_CODE_AND_NAME.find((s) => s.code === regionProp);
      const dtlRegion = DISTRICTS_CODE_AND_NAME[
        region?.name as keyof typeof DISTRICTS_CODE_AND_NAME
      ]?.find((d) => d.code === detailRegionProp);

      if (!region || !dtlRegion) {
        setFallbackLocation();
        return;
      }

      const locationName = `${region.name} ${dtlRegion.name}`;
      if (naver && naver.maps && naver.maps.Service) {
        naver.maps.Service.geocode(
          { query: locationName },
          (status, response) => {
            if (
              status === naver.maps.Service.Status.OK &&
              response.v2.meta.totalCount > 0
            ) {
              const item = response.v2.addresses[0];
              setMyPosition(+item.y, +item.x);
            } else {
              console.warn("Geocoding failed for URL params");
            }

            updateRegionAndCookie(
              { code: region.code, name: region.name },
              { code: dtlRegion.code, name: dtlRegion.name },
            );
            setStatus("success");
            return;
          },
        );
      }

      return;
    }

    // 2. Geolocation API 사용
    if (!navigator.geolocation) {
      setFallbackLocation("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMyPosition(latitude, longitude);

        const userLocation = new naver.maps.LatLng(latitude, longitude);

        naver.maps.Service.reverseGeocode(
          { coords: userLocation, orders: "legalcode" },
          (status, response) => {
            if (status !== naver.maps.Service.Status.OK) {
              setFallbackLocation();
              return;
            }

            const area1 = response.v2.results[0]?.region.area1.name;
            const area2 = response.v2.results[0]?.region.area2.name;

            const foundSiDo = SI_DO_CODE_AND_NAME.find(
              (sido) =>
                sido.name === area1 ||
                area1.includes(sido.name) ||
                sido.name.includes(area1),
            );

            if (!foundSiDo) {
              setFallbackLocation();
              return;
            }

            const siGunGuList =
              DISTRICTS_CODE_AND_NAME[
                foundSiDo.name as keyof typeof DISTRICTS_CODE_AND_NAME
              ];

            const foundSiGunGu = siGunGuList?.find(
              (siGunGu) => siGunGu.name === area2,
            );

            if (!foundSiGunGu) {
              setFallbackLocation();
              return;
            }

            updateRegionAndCookie(foundSiDo, foundSiGunGu);
            setStatus("success");
          },
        );
      },
      (error) => {
        setFallbackLocation("위치 정보 접근이 차단되었습니다.");
      },
    );
  }, []);
}
