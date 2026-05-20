import { useEffect, useRef, useState } from "react"
import { LOCATION_BTN_HTML } from "@/app/map/_etc/constants"

interface UseMapInitProps {
  mapId: string
  initialCenter?: { lat?: number; lng?: number }
}

export function useMapInit({ mapId, initialCenter }: UseMapInitProps) {
  const mapRef = useRef<naver.maps.Map | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    const mapElement = document.getElementById(mapId)
    if (!mapElement) {
      console.error(`Element with id "${mapId}" not found.`)
      return
    }

    // 1. 지도 초기화 및 위치 버튼 추가 로직
    // 초기 중심 좌표 설정 (기본값은 서울 시청)
    const center = new naver.maps.LatLng(
      initialCenter?.lat || 37.5642135,
      initialCenter?.lng || 127.0016985
    )

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
    })
    map.setCenter(center)
    mapRef.current = map

    const initListener = naver.maps.Event.once(mapRef.current, "init", () => {
      // 현재 위치 버튼 추가 로직
      const customControl = new naver.maps.CustomControl(
        LOCATION_BTN_HTML.trim(),
        {
          position: naver.maps.Position.RIGHT_BOTTOM,
        }
      )

      customControl.setMap(map)
      const customControlElement = customControl.getElement()
      // 버튼 클릭 시 현재 위치로 이동하는 로직
      naver.maps.Event.addDOMListener(customControlElement, "click", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newCenter = new naver.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              )
              map.setCenter(newCenter)
            },
            (error) => {
              console.error("Geolocation error:", error)
              map.setCenter(center)
            }
          )
        } else {
          map.setCenter(center)
        }
      })
      setIsMapLoaded(true)
    })

    return () => {
      naver.maps.Event.removeListener(initListener)
    }
  }, [mapId])

  // 2. 좌표 변경 감지 및 지도 이동 로직 (추가됨)
  useEffect(() => {
    // 지도가 로드되어 있고, 유효한 좌표가 들어왔을 때 중심 이동
    if (mapRef.current && initialCenter?.lat && initialCenter?.lng) {
      const newCenter = new naver.maps.LatLng(
        initialCenter.lat,
        initialCenter.lng
      )
      mapRef.current.setCenter(newCenter) // 또는 mapRef.current.morph(newCenter) 사용 가능
    }
  }, [initialCenter?.lat, initialCenter?.lng])

  return { mapRef, isMapLoaded }
}
