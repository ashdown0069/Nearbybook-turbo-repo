import { MatchPattern } from "#imports";
import { NAVER_BOOK_URL_PATTERN } from "@/const";

export const isNaverBookURL = (currentURL: string | undefined): boolean => {
  if (!currentURL) return false;
  const NAVER = new MatchPattern(NAVER_BOOK_URL_PATTERN);
  return NAVER.includes(currentURL);
};
