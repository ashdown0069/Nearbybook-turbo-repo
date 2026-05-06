import type { searchSettingStoreType } from "@/types/types";
import { clearSessionTabState } from "./session";

const searchSettingStore = storage.defineItem<searchSettingStoreType | null>(
  "sync:searchSettingStore",
  { fallback: null },
);

export const getSearchSetting = () => searchSettingStore.getValue();

export const setSearchSetting = async (v: searchSettingStoreType) => {
  await clearSessionTabState();
  return searchSettingStore.setValue(v);
};

export const clearSearchSetting = async () => {
  await clearSessionTabState();
  return searchSettingStore.setValue(null);
};
