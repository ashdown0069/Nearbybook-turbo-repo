import { useState, useEffect } from "react";
import * as Location from "expo-location";
// import { getDistrictCode } from "@/utils/getLibCode";
import { DEFAULT_REGION } from "@/constants";
import { DistrictCode, DistrictName } from "@repo/types";
import {
  SI_DO_CODE_AND_NAME,
  DISTRICTS_CODE_AND_NAME,
} from "@/constants/libraryCode";
import { Coordinate } from "@/types";
interface LocationAddress {
  region: string | null;
  district: string | null;
  city: string | null;
  formattedAddress: string | null;
  [key: string]: any;
}

/**
 * 좌표(location)를 입력받아 리버스 지오코딩 후 도서관 API용 지역 코드를 반환하는 훅
 */
export const useCurrentRegion = (location: Coordinate) => {
  const [regionCodes, setRegionCodes] = useState<
    (DistrictCode & DistrictName) | null
  >(null);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    const fetchRegionCode = async () => {
      if (!location) return;

      setAddressLoading(true);
      try {
        // 1. Expo 리버스 지오코딩 실행 (좌표 -> 주소 변환)
        const reversed = await Location.reverseGeocodeAsync({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        if (reversed.length > 0) {
          // 2. 주소 정보를 바탕으로 도서관 지역 코드 추출
          const info = getDistrictCode(reversed[0]);
          // console.log("변환된 주소:", reversed[0]);
          // console.log("추출된 코드:", info);

          if (info) {
            setRegionCodes(() => info);
          }
        }
      } catch (error) {
        console.error("리버스 지오코딩 실패:", error);
      } finally {
        setAddressLoading(false);
      }
    };

    fetchRegionCode();
  }, [location]); // location이 변경될 때마다 실행

  return {
    regionCodes: regionCodes ?? {
      ...DEFAULT_REGION,
      regionName: "서울시",
      districtName: "종로구",
    },
    addressLoading,
  };
};

const getDistrictCode = (
  addressObj: LocationAddress,
): (DistrictCode & DistrictName) | null => {
  if (!addressObj) return null;

  const regionName = addressObj.region?.trim();
  const city = addressObj.city?.trim() || "";
  const district = addressObj.district?.trim() || "";
  const fullAddr = addressObj.formattedAddress || "";

  // ---------------------------------------------------------
  // 🚨 1. [특수 예외] 세종특별자치시 처리
  // ---------------------------------------------------------
  if (regionName === "세종특별자치시" || fullAddr.includes("세종특별자치시")) {
    return {
      region: "29",
      dtlRegion: "29010",
      regionName: "세종특별자치시",
      districtName: "세종특별자치시", // 필요 없다면 생략 가능 (optional이므로)
    };
  }

  // ---------------------------------------------------------
  // 🔍 2. 검색 대상 준비
  // ---------------------------------------------------------
  let targets: { rName: string; list: any[] }[] = [];

  if (regionName && (DISTRICTS_CODE_AND_NAME as any)[regionName]) {
    targets.push({
      rName: regionName,
      list: (DISTRICTS_CODE_AND_NAME as any)[regionName],
    });
  } else {
    targets = Object.entries(DISTRICTS_CODE_AND_NAME).map(([key, value]) => ({
      rName: key,
      list: value as any[],
    }));
  }

  // ---------------------------------------------------------
  // ⚔️ 3. 매칭 및 결과 반환
  // ---------------------------------------------------------
  for (const { rName, list } of targets) {
    let match = null;

    // A. [조합 검색] City + District (예: 수원시 장안구)
    if (!match && city && district) {
      match = list.find((d: any) => d.name === `${city} ${district}`);
    }

    // B. [단독 검색] City (예: 성남시, 양평군)
    if (!match && city) {
      match = list.find((d: any) => d.name === city);
    }

    // C. [단독 검색] District (예: 종로구, 기장군, 달성군)
    if (!match && district) {
      match = list.find((d: any) => d.name === district);
    }

    // ✅ 매칭 성공 시
    if (match) {
      const regionCodeItem = SI_DO_CODE_AND_NAME.find(
        (item) => item.name === rName,
      );
      const regionCode = regionCodeItem ? regionCodeItem.code : null;

      if (regionCode) {
        return {
          // Code Result
          region: regionCode,
          dtlRegion: match.code,
          // Name Result
          regionName: rName, // 예: "경기도"
          districtName: match.name, // 예: "수원시 장안구"
        };
      }
    }
  }

  return null; // 못 찾음
};
