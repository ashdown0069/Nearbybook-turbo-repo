import { Tab, PopupStatus, tabState } from "@/types/types";
import { findSiteConfig, getBookInfo } from "./services/siteService";
import { getLibraryData } from "./services/libraryService";
import {
  updateExtensionIcon,
  updateBadge,
  sendLibraryNotification,
} from "./services/uiService";
import { getNotifications } from "@/utils/storage/notification";
import { FindSessionTabState } from "@/utils/storage/session";

export const processBookStoreSite = async (
  tabInfo: Tab,
  notifiedTabs: Map<number, string>,
  signal?: AbortSignal,
): Promise<{
  status: PopupStatus;
  data?: tabState;
}> => {
  if (!tabInfo.id || !tabInfo.url) return { status: "error" };

  const siteConfig = findSiteConfig(tabInfo.url);

  if (!siteConfig) {
    await updateExtensionIcon(tabInfo.id, false);
    await updateBadge("");
    return { status: "notSupport" };
  }

  try {
    await updateExtensionIcon(tabInfo.id, true);

    let state: tabState;
    try {
      const { ISBN, TITLE } = await getBookInfo(siteConfig, tabInfo.id);

      // 세션 저장소에서 캐시 데이터 확인 (ISBN 기준)
      const cachedState = await FindSessionTabState({
        ISBN,
      });

      if (cachedState) {
        // 캐시 히트: 데이터는 사용하되 URL은 현재 탭의 URL로 최신화
        state = {
          ...cachedState,
          tabUrl: tabInfo.url,
        };
      } else {
        // 캐시 미스: 도서관 데이터 API 호출
        state = await getLibraryData(ISBN, TITLE, tabInfo.url, signal);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "needsSetup") {
        throw error;
      }
      return { status: "error" };
    }

    const foundCount = state.regionResult?.foundDataLength ?? 0;
    await updateBadge(foundCount);

    // 알림 처리
    const isNotificationDelivered = notifiedTabs.get(tabInfo.id) === state.ISBN;
    const notificationStatus = await getNotifications();

    if (
      notificationStatus.isNotificationsEnabled &&
      foundCount > 0 &&
      !isNotificationDelivered
    ) {
      await sendLibraryNotification(state.TITLE, state.ISBN, foundCount);
      notifiedTabs.set(tabInfo.id, state.ISBN);
    }

    return {
      status: "complete",
      data: state,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "needsSetup") {
      return { status: "needsSetup" };
    }
    console.error("[processBookStoreSite]", error);
    await updateBadge(0);
    return { status: "error" };
  }
};
