/**
 * 지역(시도/시군구) 조회 유틸리티
 *
 * useUserRegion.ts와 useMapInteraction.ts에서 중복되던 지역 조회 로직을 통합
 * - SI_DO_CODE_AND_NAME에서 시/도 검색
 * - DISTRICTS_CODE_AND_NAME에서 시/군/구 검색
 */

import { SI_DO_CODE_AND_NAME, DISTRICTS_CODE_AND_NAME } from "@/const";

export interface District {
  name: string;
  code: string;
}

/**
 * 시/도 이름으로 검색 (정확히 일치 또는 부분 일치)
 */
export function findSiDoByName(name: string): District | undefined {
  return SI_DO_CODE_AND_NAME.find(
    (sido) =>
      sido.name === name || name.includes(sido.name) || sido.name.includes(name)
  );
}

/**
 * 시/도 이름으로 검색 (정확히 일치만)
 */
export function findSiDoByNameExact(name: string): District | undefined {
  return SI_DO_CODE_AND_NAME.find((sido) => sido.name === name);
}

/**
 * 시/도 코드로 검색
 */
export function findSiDoByCode(code: string): District | undefined {
  return SI_DO_CODE_AND_NAME.find((sido) => sido.code === code);
}

/**
 * 시/군/구 이름으로 검색
 */
export function findSiGunGuByName(
  siDoName: string,
  siGunGuName: string
): District | undefined {
  const siGunGuList =
    DISTRICTS_CODE_AND_NAME[siDoName as keyof typeof DISTRICTS_CODE_AND_NAME];

  if (!siGunGuList) return undefined;

  return siGunGuList.find((siGunGu) => siGunGu.name === siGunGuName);
}

/**
 * 시/군/구 코드로 검색
 */
export function findSiGunGuByCode(
  siDoName: string,
  code: string
): District | undefined {
  const siGunGuList =
    DISTRICTS_CODE_AND_NAME[siDoName as keyof typeof DISTRICTS_CODE_AND_NAME];

  if (!siGunGuList) return undefined;

  return siGunGuList.find((siGunGu) => siGunGu.code === code);
}

/**
 * 시/도 이름으로 해당 시/군/구 목록 반환
 */
export function getSiGunGuList(siDoName: string) {
  return (
    DISTRICTS_CODE_AND_NAME[siDoName as keyof typeof DISTRICTS_CODE_AND_NAME] ||
    []
  );
}

/**
 * 시/도와 시/군/구를 한 번에 검색 (이름 기반)
 * reverseGeocode 결과 처리에 유용
 */
export function findRegionByNames(
  siDoName: string,
  siGunGuName: string
): { siDo: District; siGunGu: District } | undefined {
  const siDo = findSiDoByName(siDoName);
  if (!siDo) return undefined;

  const siGunGu = findSiGunGuByName(siDo.name, siGunGuName);
  if (!siGunGu) return undefined;

  return { siDo, siGunGu };
}

/**
 * 시/도와 시/군/구를 한 번에 검색 (코드 기반)
 * URL 파라미터 처리에 유용
 */
export function findRegionByCodes(
  siDoCode: string,
  siGunGuCode: string
): { siDo: District; siGunGu: District } | undefined {
  const siDo = findSiDoByCode(siDoCode);
  if (!siDo) return undefined;

  const siGunGu = findSiGunGuByCode(siDo.name, siGunGuCode);
  if (!siGunGu) return undefined;

  return { siDo, siGunGu };
}
