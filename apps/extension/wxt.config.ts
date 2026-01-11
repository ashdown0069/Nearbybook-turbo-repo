import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import {
  ALADIN_BOOK_URL_PATTERN,
  KYOBO_BOOK_URL_PATTERN,
  NAVER_BOOK_URL_PATTERN,
  YES24_BOOK_URL_PATTERN,
} from "./const";

export default defineConfig({
  manifest: {
    permissions: ["storage", "tabs", "notifications", "scripting"],
    name: "NearbyBook | 온라인 서점에서 집 근처 책 찾기",
    description:
      "내가 보고 있는 온라인 서점의 도서가 집 근처 공공 도서관에 존재하는지 찾아보세요.",
    host_permissions: [
      KYOBO_BOOK_URL_PATTERN,
      YES24_BOOK_URL_PATTERN,
      ALADIN_BOOK_URL_PATTERN,
      NAVER_BOOK_URL_PATTERN,
      "https://api.nearbybook.kr/*",
    ],
    minimum_chrome_version: "114",
  },

  vite: () => ({
    plugins: [tailwindcss()],
  }),
  modules: ["@wxt-dev/module-react"],
});
