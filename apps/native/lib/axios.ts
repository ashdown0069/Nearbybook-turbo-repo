import { BACKEND_API_BASE_URL } from "@/constants/api";
import { createAxiosInstance } from "@repo/data-access";

export const axiosInstance = createAxiosInstance(BACKEND_API_BASE_URL);
