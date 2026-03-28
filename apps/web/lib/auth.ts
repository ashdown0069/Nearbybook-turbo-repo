import { setCookie, deleteCookie } from "cookies-next";

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
};

export function setAuthCookies(accessToken: string, refreshToken: string) {
  setCookie("accessToken", accessToken, COOKIE_OPTIONS);
  setCookie("refreshToken", refreshToken, COOKIE_OPTIONS);
}

export function clearAuthCookies() {
  deleteCookie("accessToken", { path: "/" });
  deleteCookie("refreshToken", { path: "/" });
}
