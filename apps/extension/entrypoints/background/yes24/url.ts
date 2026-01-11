import { MatchPattern } from "#imports";
import { YES24_BOOK_URL_PATTERN } from "@/const";

export const isYES24URL = (currentURL: string | undefined): boolean => {
  if (!currentURL) return false;
  const YES24 = new MatchPattern(YES24_BOOK_URL_PATTERN);
  return YES24.includes(currentURL);
};
