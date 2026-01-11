import { getKyoboInfoFromDOM } from "./kyobo/contentScript";
import { getYES24InfoFromDOM } from "./yes24/contentScript";
import { isKyoboURL } from "./kyobo/url";
import { isYES24URL } from "./yes24/url";
import { parsedSiteData, PopupStatus, Tab, tabState } from "@/types/types";
// import { getLibsByISBN } from "@/api/getLibsByISBN";
import { getLibsByISBNExtension } from "@repo/data-access";
import { axiosInstance } from "@/lib/axios";
import {
  setSessionTabState,
  FindSessionTabState,
} from "@/utils/storage/session";
import { setBadgeText } from "@/utils/badge";
import {
  createNotification,
  getNotifications,
} from "@/utils/storage/notification";
import { isAladinURL } from "./aladin/url";
import { getAladinInfoFromDOM } from "./aladin/contentScript";
import { isNaverBookURL } from "./naverbook/url";
import { getNaverInfoFromDOM } from "./naverbook/contentScript";
import { getDistrictPreference } from "@/utils/storage/district";

interface SiteConfig {
  name: string;
  isMatch: (url: string) => boolean;
  getBookInfoFromSite: (tabId: number) => Promise<parsedSiteData>;
}

const SUPPORTED_SITES: SiteConfig[] = [
  {
    name: "kyobo",
    isMatch: isKyoboURL,
    getBookInfoFromSite: getKyoboInfoFromDOM,
  },
  {
    name: "yes24",
    isMatch: isYES24URL,
    getBookInfoFromSite: getYES24InfoFromDOM,
  },
  {
    name: "aladin",
    isMatch: isAladinURL,
    getBookInfoFromSite: getAladinInfoFromDOM,
  },
  {
    name: "naver",
    isMatch: isNaverBookURL,
    getBookInfoFromSite: getNaverInfoFromDOM,
  },
];

const findSiteConfig = (url: string) => {
  return SUPPORTED_SITES.find((site) => site.isMatch(url));
};

const getBookInfo = async (siteConfig: SiteConfig, tabId: number) => {
  const { ISBN, TITLE } = await siteConfig.getBookInfoFromSite(tabId);
  if (!ISBN) {
    throw new Error("ISBN not found");
  }
  return { ISBN, TITLE };
};

const getLibraryData = async (ISBN: string, TITLE: string, tabUrl: string) => {
  let tabState = await FindSessionTabState({ ISBN });

  if (!tabState) {
    const districtPreference = await getDistrictPreference();
    const libraries = await getLibsByISBNExtension(
      axiosInstance,
      ISBN,
      districtPreference.SiDo.code,
      districtPreference.SiGunGu.code,
    );
    tabState = {
      ISBN,
      TITLE,
      foundDataLength: libraries.length,
      tabUrl,
      libraries,
    };
    await setSessionTabState(ISBN, TITLE, libraries.length, tabUrl, libraries);
  }

  return tabState;
};

export const processBookStoreSite = async (
  tabInfo: Tab,
  notifiedTabs: Map<number, string>,
): Promise<{
  status: PopupStatus;
  data?: tabState;
}> => {
  if (!tabInfo.id) return { status: "error" };

  const siteConfig = findSiteConfig(tabInfo.url);

  //지원사이트 X
  if (!siteConfig) {
    // browser.action.disable();
    await browser.action.setIcon({
      tabId: tabInfo.id,
      path: {
        "16": "/icon/16.png",
        "32": "/icon/32.png",
      },
    });
    await setBadgeText("");
    return { status: "notSupport" };
  }

  try {
    await browser.action.setIcon({
      tabId: tabInfo.id,
      path: {
        "16": "/icon/16_ON.png",
        "32": "/icon/32_ON.png",
      },
    });
    await setBadgeText(0);

    const { ISBN, TITLE } = await getBookInfo(siteConfig, tabInfo.id);
    const { foundDataLength, libraries } = await getLibraryData(
      ISBN,
      TITLE,
      tabInfo.url,
    );

    await setBadgeText(foundDataLength);

    const isNotificationDelivered = notifiedTabs.get(tabInfo.id) === ISBN;
    const status = await getNotifications();
    //알림 보내기
    if (
      status.isNotificationsEnabled &&
      foundDataLength > 0 &&
      !isNotificationDelivered
    ) {
      const notificationTitle = `책 소장 도서관 찾기`;
      const notificationDescription = `${TITLE}을(를) 소장하고 있는 ${foundDataLength} 곳의 도서관을 찾았습니다`;
      await createNotification(
        notificationTitle,
        notificationDescription,
        ISBN,
      );
      notifiedTabs.set(tabInfo.id, ISBN);
    }

    return {
      status: "complete",
      data: {
        TITLE,
        ISBN,
        foundDataLength,
        libraries,
      } as unknown as tabState,
    };
  } catch (error) {
    console.log("bg process", error);
    await setBadgeText("0");
    return { status: "error" };
  }
};
