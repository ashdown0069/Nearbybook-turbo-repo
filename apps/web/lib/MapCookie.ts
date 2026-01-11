import Cookies from "js-cookie";
import type { Region } from "@/types/type";

export function setRegionCookie(data: Region) {
  const stringifiedData = JSON.stringify(data);

  Cookies.set("user_region_data", stringifiedData, {
    secure: process.env.NODE_ENV === "production",
    path: "/", // 모든 경로에서 접근 가능
    expires: 7, // 7일
    sameSite: "Lax", // CSRF 보호 수준
  });

  return { success: true };
}

// 2. 쿠키 가져오기 함수
export function getRegionCookie(): Region | null {
  // 쿠키 값 읽기 (문자열 반환)
  const data = Cookies.get("user_region_data");

  if (!data) return null;

  try {
    // 문자열을 다시 객체로 변환
    const parsedData: Region = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.error("Failed to parse region cookie:", error);
    return null;
  }
}

export function removeRegionCookie() {
  Cookies.remove("user_region_data", { path: "/" });
}
