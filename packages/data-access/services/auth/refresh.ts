import type { AxiosInstance } from "axios";
import { RefreshTokenRequest, RefreshTokenResponse } from "@repo/types";

export const refreshToken = async (
  axiosInstance: AxiosInstance,
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  return axiosInstance.post("/auth/refresh", data).then((res) => res.data);
};
