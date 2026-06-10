import { createAxiosInstance } from "@workspace/data-access"

export const axiosInstance = createAxiosInstance(
  process.env.NEXT_PUBLIC_BACKEND_URL!
)
