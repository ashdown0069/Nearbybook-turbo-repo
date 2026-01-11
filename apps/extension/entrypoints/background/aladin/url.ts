import { MatchPattern } from "#imports";
import { ALADIN_BOOK_URL_PATTERN } from "@/const";
export const isAladinURL = (currentURL: string | undefined): boolean => {
  if (!currentURL) return false;
  const ALADIN = new MatchPattern(ALADIN_BOOK_URL_PATTERN);
  return ALADIN.includes(currentURL);
};
