import { createAxiosInstance } from "@workspace/data-access"
export const axiosInstance = createAxiosInstance(
  import.meta.env.WXT_BACKEND_URL
)
