import { Library } from "@workspace/types";

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

export interface searchSettingStoreType {
  SiDo: district;
  SiGunGu: district;
  library: { libCode: string; libName: string };
  defaultTab: "region" | "library";
}

export interface regionResult {
  libraries: Library[];
  foundDataLength: number;
}

export interface libraryResult {
  libCode: string;
  libName: string;
  hasBook: boolean;
  loanAvailable: boolean | null;
  bookCode: string | null;
  shelfLocation: string | null;
  address: string | null;
  homepage: string | null;
}

export interface tabState {
  tabUrl: string;
  ISBN: string;
  TITLE: string;
  regionResult: regionResult | null;
  libraryResult: libraryResult | null;
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
  | "notSupport"
  | "needsSetup"
  | "retry";

export interface BackgroundPopupState {
  status: PopupStatus;
  port: Browser.runtime.Port | null;
  data?: tabState;
  searchSetting?: searchSettingStoreType;
}

export type PopupPortMessage = Pick<
  BackgroundPopupState,
  "status" | "data" | "searchSetting"
>;
