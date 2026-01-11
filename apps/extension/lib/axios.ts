import { createAxiosInstance } from "@repo/data-access";
export const axiosInstance = createAxiosInstance(
  import.meta.env.WXT_BACKEND_URL,
);
