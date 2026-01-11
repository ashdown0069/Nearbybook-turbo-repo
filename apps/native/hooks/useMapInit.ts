import { useState, useEffect, useCallback, useRef } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";
import { withTimeout } from "@/lib/utils";
import { DEFAULT_LOCATION } from "@/constants";
import { storage } from "@/lib/mmkvStore";
import { Coordinate } from "@/types";
export const useMapInit = (screenLocation?: any, callback?: () => void) => {
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Callback
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 2. 언마운트 체크를 위한 Ref
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const applyDefaultLocation = () => {
    if (!isMounted.current) return;
    setLocation(DEFAULT_LOCATION);
    setIsLoading(false);
  };

  const getLocation = useCallback(async () => {
    if (!isMounted.current) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      //mmkv store에 저장된 마지막 위치 있을 경우
      const jsonLastLocation = storage.getString("location");
      const lastLocation = jsonLastLocation
        ? JSON.parse(jsonLastLocation)
        : null;

      // 저장된 데이터가 LocationObject 형태(coords 포함)인지 확인
      if (lastLocation.coords) {
        setLocation({
          latitude: lastLocation.coords.latitude,
          longitude: lastLocation.coords.longitude,
        });
        setIsLoading(false);
        return;
      }

      // 1. 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        applyDefaultLocation();
        return;
      }

      // 2. GPS 서비스 체크
      const isGPSEnabled = await Location.hasServicesEnabledAsync();
      if (!isGPSEnabled && Platform.OS === "android") {
        try {
          // Android GPS 켜기 요청 (Rate Limit 등에 주의)
          await Location.enableNetworkProviderAsync();
        } catch {
          applyDefaultLocation();
          return;
        }
      }

      // 3. 마지막으로 알려진 위치 먼저 빠르게 가져오기
      try {
        const lastKnownPosition = await Location.getLastKnownPositionAsync();
        if (lastKnownPosition && isMounted.current) {
          setLocation(() => ({
            latitude: lastKnownPosition.coords.latitude,
            longitude: lastKnownPosition.coords.longitude,
          }));
        }
      } catch {
        // 무시하고 현재 위치 시도
      }

      // 4. 현재 위치 정밀하게 가져오기
      try {
        const currentPosition = await withTimeout(
          Location.getCurrentPositionAsync({
            // 지도 초기화용으로는 Balanced가 적당 (Low는 너무 부정확)
            accuracy: Location.Accuracy.Balanced,
          }),
          5000, // 5초
        );

        if (isMounted.current) {
          console.log("현 위치 요청 성공", currentPosition);
          storage.set("location", JSON.stringify(currentPosition));
          setLocation(() => ({
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
          }));

          // Ref에 저장된 콜백 실행 (의존성 문제 해결)
          if (callbackRef.current) {
            callbackRef.current();
          }
        }
      } catch {
        console.log("현 위치 요청 실패/타임아웃");
        // 마지막 위치도 못 가져왔고, 현재 위치도 실패했을 때만 Default 적용
        setLocation((prev) => prev || DEFAULT_LOCATION);
      }
    } catch {
      if (isMounted.current) {
        setErrorMsg("위치 정보를 가져오는 중 오류가 발생했습니다.");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return {
    location: location ?? DEFAULT_LOCATION,
    setLocation,
    errorMsg,
    isLoading,
    refetch: getLocation,
  };
};
