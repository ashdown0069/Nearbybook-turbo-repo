"use client";

import { useMapStore } from "@/store/useMapStore";
import { useUserRegion } from "../_hooks/useUserRegion";
import { useEffect } from "react";
import { toast } from "sonner";
import MapSidebar from "./MapSidebar";
import LoadingScreen from "@/components/Loading";
import ErrorScreen from "@/components/Error";
import { useSearchBook } from "@repo/data-access";
import MapCanvas from "./MapCanvas";
import { MapProps } from "@/types/type";
import { useShallow } from "zustand/shallow";
import { useGetLibsByISBN } from "@repo/data-access";
import { axiosInstance } from "@/lib/axios";
export default function Map({
  isbn,
  region: regionProp,
  dtlRegion: detailRegionProp,
}: MapProps) {
  useUserRegion({ region: regionProp, dtlRegion: detailRegionProp });
  const { region, dtl_region, status, myLat, myLng } = useMapStore(
    useShallow((state) => ({
      region: state.region,
      dtl_region: state.dtl_region,
      status: state.status,
      myLat: state.myLat,
      myLng: state.myLng,
    })),
  );

  const {
    data: libsData,
    isLoading: isLibsLoading,
    isError: libsError,
    refetch: refetchLibs,
  } = useGetLibsByISBN(
    axiosInstance,
    isbn,
    region?.code || "",
    dtl_region?.code || "",
  );

  const {
    data: bookData,
    isLoading: isBooksLoading,
    isError: isBooksError,
    refetch: refetchBook,
  } = useSearchBook(axiosInstance, isbn);

  const isLoading = isLibsLoading || status == "loading" || isBooksLoading;
  const hasData = libsData && bookData && myLat && myLng;
  useEffect(() => {
    if (
      libsData &&
      libsData.length > 0 &&
      libsData.every((lib) => !lib.hasBook)
    ) {
      toast.warning("검색 결과가 없습니다.");
    }
  }, [libsData]);
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (libsError || isBooksError) {
    return (
      <ErrorScreen
        resetErrorBoundary={() => {
          if (libsError) {
            refetchLibs();
          }
          if (isBooksError) {
            refetchBook();
          }
        }}
      />
    );
  }

  return (
    <div className="relative flex h-dvh w-full overflow-hidden">
      {hasData && (
        <>
          <MapSidebar book={bookData} />
          <MapCanvas libraryList={libsData || []} isbn={isbn} />
        </>
      )}
    </div>
  );
}
