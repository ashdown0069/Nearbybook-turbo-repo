import { Button } from "@repo/ui/components/button";
import { useMapStore } from "@/store/useMapStore";
import { Library } from "@repo/types";
import { RotateCcw } from "lucide-react";
import { useMapInit } from "@/app/map/_hooks/useMapInit";
import { useMapMarkers } from "@/app/map/_hooks/useMapMarkers";
import { useMapInteraction } from "@/app/map/_hooks/useMapInteraction";
import { INDIGO_MARKER_HTML, GRAY_MARKER_HTML } from "@/app/map/_etc/constants";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
const MapOverlayContent = dynamic(() => import("./MapOverlayContent"), {
  ssr: false,
});

interface MapCanvasProps {
  libraryList: Library[];
  isbn: string;
}

export default function MapCanvas({ libraryList, isbn }: MapCanvasProps) {
  const { myLat, myLng, region, dtl_region } = useMapStore(
    useShallow((state) => ({
      myLat: state.myLat,
      myLng: state.myLng,
      region: state.region,
      dtl_region: state.dtl_region,
    })),
  );
  const { mapRef } = useMapInit({
    mapId: "map",
    initialCenter: { lat: myLat, lng: myLng },
  });

  const getMarkerIcon = useCallback(
    (lib: Library) => (lib.hasBook ? INDIGO_MARKER_HTML : GRAY_MARKER_HTML),
    [],
  );

  const getOverlayContent = useCallback(
    (lib: Library) => <MapOverlayContent {...lib} isbn={isbn} />,
    [isbn],
  );

  useMapMarkers({
    mapRef,
    libraries: libraryList,
    getMarkerIcon,
    getOverlayContent,
  });

  const { showSearchBtn, handleSearchAgain } = useMapInteraction(mapRef);

  return (
    <div id="map" className="relative h-full w-full md:w-2/3">
      {region?.name && (
        <div className="absolute top-5 left-4/5 z-10 w-max -translate-x-1/2 rounded-2xl bg-indigo-500 p-3 px-3 text-white">
          {region.name} {dtl_region?.name && dtl_region.name}
        </div>
      )}
      {showSearchBtn && (
        <Button
          onClick={handleSearchAgain}
          variant={"outline"}
          className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 transform cursor-pointer bg-green-500 p-5 text-white hover:bg-green-400 hover:text-white"
        >
          <RotateCcw />
          다시 검색하기
        </Button>
      )}
    </div>
  );
}
