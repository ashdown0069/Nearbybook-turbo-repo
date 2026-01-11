import { MatchPattern } from "#imports";
import { KYOBO_BOOK_URL_PATTERN } from "@/const";
export const isKyoboURL = (currentURL: string | undefined): boolean => {
  if (!currentURL) return false;
  const KYOBO = new MatchPattern(KYOBO_BOOK_URL_PATTERN);
  return KYOBO.includes(currentURL);
};
