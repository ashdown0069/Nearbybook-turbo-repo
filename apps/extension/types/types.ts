import { Library } from "@repo/types";

export interface district {
  name: string;
  code: string;
}
export interface districtList {
  name: string;
  code: string;
  adjacency: district[];
}

export interface userDistrictState {
  siDo: string;
  siGunGu: district;
}

export interface tabState {
  tabUrl: string;
  ISBN: string;
  TITLE: string;
  foundDataLength: number;
  libraries: Library[];
}

export interface tabStateSessionStore {
  session: tabState[];
}

export interface Tab {
  status: "unloaded" | "loading" | "complete" | undefined;
  index: number;
  openerTabId: number;
  title: string;
  url: string;
  pendingUrl: string;
  pinned: boolean;
  highlighted: boolean;
  windowId: number;
  active: boolean;
  favIconUrl: string;
  frozen: boolean;
  id: number;
  incognito: boolean;
  selected: boolean;
  audible: boolean;
  discarded: boolean;
  autoDiscardable: boolean;
  mutedInfo: globalThis.Browser.tabs.MutedInfo;
  width: number;
  height: number;
  sessionId: string;
  groupId: number;
  lastAccessed: number;
}

export interface parsedSiteData {
  ISBN: string;
  TITLE: string;
}

export interface SessionSidePanelData {
  isbn: string | null;
  isOpen: boolean;
  triggeredBy: "popup" | "sidepanel" | "contextMenu";
}

export type PopupStatus =
  | "idle"
  | "pending"
  | "complete"
  | "error"
  | "notSupport";

export interface BackgroundPopupState {
  status: PopupStatus;
  port: Browser.runtime.Port | null;
  data?: tabState;
  district?: districtPreferenceStoreType;
}
export type PopupPortMessage = Pick<
  BackgroundPopupState,
  "status" | "data" | "district"
>;

export interface districtPreferenceStoreType {
  SiDo: district;
  SiGunGu: district;
  AdjacencySiGunGuList: district[];
}
