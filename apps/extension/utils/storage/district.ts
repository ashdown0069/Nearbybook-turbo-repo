import type { districtPreferenceStoreType } from "@/types/types";

const districtPreferenceStore = storage.defineItem<districtPreferenceStoreType>(
  "sync:districtPreferenceStore",
  {
    fallback: {
      SiDo: {
        code: "11",
        name: "서울특별시",
      },
      SiGunGu: {
        code: "11010",
        name: "종로구",
      },
      AdjacencySiGunGuList: [],
    },
  },
);

export const getDistrictPreference = async () => {
  const foundData = await districtPreferenceStore.getValue();
  return foundData;
};

export const setDistrictPreference = async (
  SiDo: districtPreferenceStoreType["SiDo"],
  SiGunGu: districtPreferenceStoreType["SiGunGu"],
  AdjacencySiGunGuList: districtPreferenceStoreType["AdjacencySiGunGuList"],
) => {
  return await districtPreferenceStore.setValue({
    SiDo,
    SiGunGu,
    AdjacencySiGunGuList,
  });
};
