"use client";
import React, { useState, useMemo, useCallback } from "react";
import MapCheckBox from "@/app/map/_components/MapCheckBox";
import { SI_DO_CODE_AND_NAME } from "@/const";
import { useGetLibsList } from "@repo/data-access";
import { useMapInit } from "@/app/map/_hooks/useMapInit";
import { useMapMarkers } from "@/app/map/_hooks/useMapMarkers";
import { LIBRARY_MARKER_HTML } from "@/app/map/_etc/constants";
import MapOverlayContent from "../_components/MapOverlayContent";
import { axiosInstance } from "@/lib/axios";
import type { Library } from "@repo/types";

export default function LibsPage() {
  // --- 1. 상태 관리 ---
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const allCodes = useMemo(() => SI_DO_CODE_AND_NAME.map((r) => r.code), []);

  // --- 2. 지도 초기화  ---
  const { mapRef } = useMapInit({ mapId: "libsMap" });

  // --- 3. 데이터 패칭 (React Query Hook) ---
  // 리턴값 형식: { "11": QueryResult, "26": QueryResult, ... }
  const queriesByRegion = useGetLibsList(axiosInstance, selectedRegions);

  // --- 4. 데이터 가공  ---
  const { filteredLibraries, isLoading, isError } = useMemo(() => {
    const libs: Library[] = [];
    let loading = false;
    let error = false;

    // 선택된 지역들을 순회하며 데이터 수집
    selectedRegions.forEach((regionCode) => {
      const query = queriesByRegion[regionCode];

      if (!query) return;

      // 데이터가 있으면 배열에 추가
      if (query.data) {
        libs.push(...query.data);
      }

      // 로딩 및 에러 상태 체크
      if (query.isLoading) loading = true;
      if (query.isError) error = true;
    });

    return { filteredLibraries: libs, isLoading: loading, isError: error };
  }, [queriesByRegion, selectedRegions]);

  // --- 5. 이벤트 핸들러 ---
  const handleRegionChange = useCallback((code: string, checked: boolean) => {
    setSelectedRegions((prev) =>
      checked
        ? prev.includes(code)
          ? prev
          : [...prev, code]
        : prev.filter((c) => c !== code),
    );
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedRegions((prev) =>
      prev.length === allCodes.length ? [] : allCodes,
    );
  }, [allCodes]);

  // --- 6. 마커 관련 콜백 (불필요한 재생성 방지) ---
  const getMarkerIcon = useCallback(() => LIBRARY_MARKER_HTML, []);

  const getOverlayContent = useCallback(
    (lib: Library) => <MapOverlayContent {...lib} />,
    [],
  );

  // --- 7. 마커 렌더링 훅 연결 ---
  useMapMarkers({
    mapRef,
    libraries: filteredLibraries,
    getMarkerIcon,
    getOverlayContent,
  });

  return (
    <div className="relative h-screen w-full">
      {/* 지도 영역 */}
      <div id="libsMap" className="h-full w-full"></div>

      {/* 컨트롤 패널 */}
      <MapCheckBox
        selectedRegions={selectedRegions}
        onRegionChange={handleRegionChange}
        onToggleAll={handleToggleAll}
        isLoading={isLoading}
        isError={isError}
        libraryCount={filteredLibraries.length}
      />
    </div>
  );
}
