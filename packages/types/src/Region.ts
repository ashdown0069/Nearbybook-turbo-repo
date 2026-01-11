export interface DistrictCode {
  region: string; // 시/도 코드 (예: "31")
  dtlRegion: string; // 시/군/구 코드 (예: "31011")
}

export interface DistrictName {
  regionName: string; // 시/도 이름 (예: "경기도")
  districtName?: string; // 시/군/구 이름 (예: "수원시 장안구")
}
