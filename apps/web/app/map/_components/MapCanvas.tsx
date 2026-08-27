import { Button } from "@workspace/ui/components/button"
import { useMapStore } from "@/store/useMapStore"
import { Library } from "@workspace/types"
import { RotateCcw } from "lucide-react"
import { useMapInit } from "@/app/map/_hooks/useMapInit"
import { useMapMarkers } from "@/app/map/_hooks/useMapMarkers"
import { useMapInteraction } from "@/app/map/_hooks/useMapInteraction"
import {
  INDIGO_MARKER_HTML,
  GRAY_MARKER_HTML,
  MY_LOCATION_MARKER_HTML,
} from "@/app/map/_etc/constants"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef } from "react"
import { useShallow } from "zustand/shallow"

const MapOverlayContent = dynamic(() => import("./MapOverlayContent"), {
  ssr: false,
})

interface MapCanvasProps {
  libraryList: Library[]
  isbn: string
}

export default function MapCanvas({ libraryList, isbn }: MapCanvasProps) {
  const { myLat, myLng, region, dtl_region, isLocationAllowed } = useMapStore(
    useShallow((state) => ({
      myLat: state.myLat,
      myLng: state.myLng,
      region: state.region,
      dtl_region: state.dtl_region,
      isLocationAllowed: state.isLocationAllowed,
    }))
  )
  const { mapRef } = useMapInit({
    mapId: "map",
    initialCenter: { lat: myLat, lng: myLng },
  })

  // 내 위치(파란 점) 마커 인스턴스 관리
  const myLocationMarkerRef = useRef<naver.maps.Marker | null>(null)

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // 위치 권한이 없거나 좌표가 없으면 기존 마커 제거
    if (!isLocationAllowed || !myLat || !myLng) {
      if (myLocationMarkerRef.current) {
        myLocationMarkerRef.current.setMap(null)
        myLocationMarkerRef.current = null
      }
      return
    }

    const position = new naver.maps.LatLng(myLat, myLng)

    // 마커가 이미 있으면 위치만 업데이트, 없으면 새로 생성
    if (myLocationMarkerRef.current) {
      myLocationMarkerRef.current.setPosition(position)
    } else {
      myLocationMarkerRef.current = new naver.maps.Marker({
        position,
        map,
        icon: {
          content: MY_LOCATION_MARKER_HTML,
          anchor: new naver.maps.Point(12, 12),
        },
        zIndex: 100,
      })
    }

    return () => {
      myLocationMarkerRef.current?.setMap(null)
      myLocationMarkerRef.current = null
    }
  }, [mapRef, isLocationAllowed, myLat, myLng])

  const getMarkerIcon = useCallback(
    (lib: Library) => (lib.hasBook ? INDIGO_MARKER_HTML : GRAY_MARKER_HTML),
    []
  )

  const getOverlayContent = useCallback(
    (lib: Library) => <MapOverlayContent {...lib} isbn={isbn} />,
    [isbn]
  )

  useMapMarkers({
    mapRef,
    libraries: libraryList,
    getMarkerIcon,
    getOverlayContent,
  })

  const { showSearchBtn, handleSearchAgain } = useMapInteraction(mapRef)

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
          className="absolute bottom-10 left-1/2 z-50 -translate-x-1/2 transform cursor-pointer bg-green-500 p-5 text-white shadow-lg hover:bg-green-400 hover:text-white md:bottom-6"
        >
          <RotateCcw />
          다시 검색하기
        </Button>
      )}
    </div>
  )
}
