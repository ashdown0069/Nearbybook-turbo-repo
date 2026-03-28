import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import { LoginRequest, AuthResponse } from "@repo/types";

export const login = async (
  axiosInstance: AxiosInstance,
  data: LoginRequest
): Promise<AuthResponse> => {
  return axiosInstance.post("/auth/login", data).then((res) => res.data);
};

export const useLogin = (
  axiosInstance: AxiosInstance,
  options?: Omit<
    UseMutationOptions<AuthResponse, Error, LoginRequest>,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(axiosInstance, data),
    ...options,
  });
};
