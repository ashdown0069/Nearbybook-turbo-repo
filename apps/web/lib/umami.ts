/**
 * Umami 커스텀 이벤트를 안전하게 전송하는 헬퍼 함수.
 *
 * @param name - 이벤트명 (예: "search-submit")
 * @param data - 이벤트에 첨부할 속성 (선택)
 */
export function trackEvent(
  name: string,
  data?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined") {
    if (typeof window.umami?.track === "function") {
      window.umami.track(name, data)
    } else if (process.env.NODE_ENV === "development") {
      console.log(`[Umami Debug] Event: "${name}"`, data)
    }
  }
}
