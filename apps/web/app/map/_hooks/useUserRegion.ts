"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useMapStore } from "@/store/useMapStore";
import type { Region } from "@/types/type";
import { setRegionCookie } from "@/lib/MapCookie";
import { useShallow } from "zustand/shallow";
import {
  findRegionByCodes,
  findRegionByNames,
} from "@/app/map/_utils/regionLookup";

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
    let cancelled = false;

    // 1. URL 파라미터 로직
    if (regionProp && detailRegionProp) {
      const result = findRegionByCodes(regionProp, detailRegionProp);

      if (!result) {
        setFallbackLocation();
        return;
      }

      const { siDo, siGunGu } = result;
      const locationName = `${siDo.name} ${siGunGu.name}`;

      if (naver?.maps?.Service) {
        naver.maps.Service.geocode(
          { query: locationName },
          (status, response) => {
            if (cancelled) return;

            if (
              status === naver.maps.Service.Status.OK &&
              response.v2.meta.totalCount > 0
            ) {
              const item = response.v2.addresses[0];
              setMyPosition(+item.y, +item.x);
            }

            updateRegionAndCookie(siDo, siGunGu);
            setStatus("success");
          },
        );
      } else {
        updateRegionAndCookie(siDo, siGunGu);
        setStatus("success");
      }

      return () => {
        cancelled = true;
      };
    }

    // 2. Geolocation API 사용
    if (!navigator.geolocation) {
      setFallbackLocation("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;

        const { latitude, longitude } = position.coords;
        setMyPosition(latitude, longitude);

        const userLocation = new naver.maps.LatLng(latitude, longitude);

        naver.maps.Service.reverseGeocode(
          { coords: userLocation, orders: "legalcode" },
          (status, response) => {
            if (cancelled) return;

            if (status !== naver.maps.Service.Status.OK) {
              setFallbackLocation();
              return;
            }

            const area1 = response.v2.results[0]?.region.area1.name;
            const area2 = response.v2.results[0]?.region.area2.name;

            const result = findRegionByNames(area1, area2);

            if (!result) {
              setFallbackLocation();
              return;
            }

            updateRegionAndCookie(result.siDo, result.siGunGu);
            setStatus("success");
          },
        );
      },
      () => {
        if (!cancelled) {
          setFallbackLocation("위치 정보 접근이 차단되었습니다.");
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [regionProp, detailRegionProp]);
}
