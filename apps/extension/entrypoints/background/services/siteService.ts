import { getKyoboInfoFromDOM } from "../kyobo/contentScript";
import { getYES24InfoFromDOM } from "../yes24/contentScript";
import { isKyoboURL } from "../kyobo/url";
import { isYES24URL } from "../yes24/url";
import { isAladinURL } from "../aladin/url";
import { getAladinInfoFromDOM } from "../aladin/contentScript";
import { isNaverBookURL } from "../naverbook/url";
import { getNaverInfoFromDOM } from "../naverbook/contentScript";
import { parsedSiteData } from "@/types/types";

export interface SiteConfig {
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

export const findSiteConfig = (url: string) => {
  return SUPPORTED_SITES.find((site) => site.isMatch(url));
};

export const getBookInfo = async (siteConfig: SiteConfig, tabId: number) => {
  const { ISBN, TITLE } = await siteConfig.getBookInfoFromSite(tabId);
  if (!ISBN) {
    throw new Error("ISBN not found");
  }
  return { ISBN, TITLE };
};
