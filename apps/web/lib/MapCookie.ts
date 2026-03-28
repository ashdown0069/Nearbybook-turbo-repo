import { setCookie, getCookie, deleteCookie } from "cookies-next";
import type { Region } from "@/types/type";

export function setRegionCookie(data: Region) {
  const stringifiedData = JSON.stringify(data);

  setCookie("user_region_data", stringifiedData, {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7일 (초 단위)
    sameSite: "lax",
  });

  return { success: true };
}

export function getRegionCookie(): Region | null {
  const data = getCookie("user_region_data");

  if (!data) return null;

  try {
    const parsedData: Region = JSON.parse(data as string);
    return parsedData;
  } catch (error) {
    console.error("Failed to parse region cookie:", error);
    return null;
  }
}

export function removeRegionCookie() {
  deleteCookie("user_region_data", { path: "/" });
}
