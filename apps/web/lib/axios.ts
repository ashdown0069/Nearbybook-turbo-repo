import { createAxiosInstance } from "@repo/data-access";
import { getCookie } from "cookies-next";
import { setAuthCookies, clearAuthCookies } from "./auth";

export const axiosInstance = createAxiosInstance(
  process.env.NEXT_PUBLIC_BACKEND_URL!,
);

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie("refreshToken");

      if (!refreshToken) {
        clearAuthCookies();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }

      try {
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
          { refreshToken },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        setAuthCookies(newAccessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        clearAuthCookies();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
