import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import { SignupRequest, AuthResponse } from "@repo/types";

export const signup = async (
  axiosInstance: AxiosInstance,
  data: SignupRequest
): Promise<AuthResponse> => {
  return axiosInstance.post("/auth/signup", data).then((res) => res.data);
};

export const useSignup = (
  axiosInstance: AxiosInstance,
  options?: Omit<
    UseMutationOptions<AuthResponse, Error, SignupRequest>,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: (data: SignupRequest) => signup(axiosInstance, data),
    ...options,
  });
};
