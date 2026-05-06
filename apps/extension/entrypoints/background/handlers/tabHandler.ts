import { Tab } from "@/types/types";
import { processBookStoreSite } from "../processBookStoreSite";
import { updatePopupStatus } from "./popupHandler";
import { updateBadge } from "../services/uiService";

let currentRequestId = 0;

export const handleTabActivation = async (
  tabId: number,
  notifiedTabs: Map<number, string>,
  signal?: AbortSignal,
) => {
  try {
    updatePopupStatus("pending");
    const tabInfo = await browser.tabs.get(tabId);

    if (tabInfo.url?.startsWith("chrome://") || tabInfo.url === undefined) {
      updatePopupStatus("pending");
      await updateBadge("");
      return;
    }

    const requestId = ++currentRequestId;
    const result = await processBookStoreSite(
      tabInfo as Tab,
      notifiedTabs,
      signal,
    );

    if (requestId === currentRequestId && result) {
      updatePopupStatus(result.status, result.data);
    }
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return;
    }
    updatePopupStatus("error");
    console.error("[tabHandler] handleTabActivation error", e);
  }
};
