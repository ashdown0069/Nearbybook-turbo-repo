"use server"
import { redirect } from "next/navigation"
import { validateISBN13 } from "./lib/isISBN13"
export async function searchAction(prevState: any, formData: FormData) {
  const query = formData.get("query") as string
  const mode = formData.get("mode") as "title" | "isbn"
  // ─── 공통 유효성 검사 ─────────────────────────────────
  if (!query || query.trim().length === 0) {
    return {
      query,
      mode,
      error: "검색어를 입력해주세요.",
      success: false,
    }
  }
  if (mode === "title" && query.trim().length < 2) {
    return {
      query,
      mode,
      error: "검색어는 최소 2글자 이상 입력해주세요.",
      success: false,
    }
  }
  // ─── ISBN 모드: ISBN-13 정밀 검증 ─────────────────────
  if (mode === "isbn") {
    const result = validateISBN13(query)
    if (!result.valid) {
      return {
        query,
        mode,
        error: result.message, // 에러 코드별 구체적 메시지 반환
        success: false,
      }
    }
    // 검증 통과 시, 정제된 ISBN(하이픈 제거)으로 검색
    const url =
      "/search?query=" +
      encodeURIComponent(result.isbn) +
      "&mode=" +
      mode +
      "&pageNo=1"
    redirect(url)
  }
  // ─── 제목 모드: 그대로 검색 ───────────────────────────
  const url =
    "/search?query=" + encodeURIComponent(query) + "&mode=" + mode + "&pageNo=1"
  redirect(url)
}
