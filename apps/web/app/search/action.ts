"use server";

import { redirect } from "next/navigation";

export async function searchAction(prevState: any, formData: FormData) {
  const query = formData.get("query") as string;
  const mode = formData.get("mode") as "title" | "isbn";

  // 서버 사이드 유효성 검사
  if (!query || query.trim().length === 0) {
    return {
      query,
      mode,
      error: "검색어를 입력해주세요.",
      success: false,
    };
  }

  if (query.trim().length < 2) {
    return {
      query,
      mode,
      error: "검색어는 최소 2글자 이상 입력해주세요.",
      success: false,
    };
  }

  // ^: 문자열의 시작
  // \d+: 하나 이상의 숫자(0-9)
  // $: 문자열의 끝
  const isbnRegex = /^\d+$/;

  if (mode === "isbn") {
    if (!isbnRegex.test(query)) {
      return {
        query,
        mode,
        error: "ISBN은 숫자만 입력가능합니다.",
        success: false,
      };
    } else if (query.length !== 13) {
      return {
        query,
        mode,
        error: "ISBN은 13자리여야 합니다.",
        success: false,
      };
    }
  }

  const url =
    "/search?query=" +
    encodeURIComponent(query) +
    "&mode=" +
    mode +
    "&pageNo=1";
  // 실제 검색 로직 처리
  redirect(url);

  return {
    query,
    mode,
    error: null,
    success: true,
  };
}
