import { BackgroundPopupState, Tab } from "@/types/types";
import { getSearchSetting } from "@/utils/storage/searchSetting";
import { processBookStoreSite } from "../processBookStoreSite";

let popupState: BackgroundPopupState = {
  status: "idle",
  data: undefined,
  port: null,
  searchSetting: undefined,
};

export const updatePopupStatus = (
  newStatus: BackgroundPopupState["status"],
  data?: BackgroundPopupState["data"],
) => {
  popupState.status = newStatus;
  popupState.data = data;

  if (popupState.port) {
    try {
      popupState.port.postMessage({
        status: popupState.status,
        data: popupState.data,
        searchSetting: popupState.searchSetting,
      });
    } catch {
      popupState.port = null;
    }
  }
};

export const handlePopupConnect = async (
  port: Browser.runtime.Port,
  notifiedTabs: Map<number, string>,
  signal?: AbortSignal,
) => {
  if (port.name !== "popup-port") return;

  popupState.port = port;
  const searchSetting = await getSearchSetting();
  popupState.searchSetting = searchSetting ?? undefined;

  if (!searchSetting) {
    updatePopupStatus("needsSetup");
    return;
  }

  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tabs[0]?.id) {
    updatePopupStatus("pending");

    //오류 발생할 경우
    //processBookStoreSite의 결과로
    //updatePopupStatus에서 처리됨
    const result = await processBookStoreSite(
      tabs[0] as Tab,
      notifiedTabs,
      signal,
    );
    updatePopupStatus(result.status, result.data);
  } else {
    updatePopupStatus("notSupport");
  }
  port.onDisconnect.addListener(() => {
    popupState.port = null;
  });
};
