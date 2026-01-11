// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
//   timeout: 5000,
//   maxRedirects: 3,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

import { createAxiosInstance } from "@repo/data-access";
export const axiosInstance = createAxiosInstance(
  process.env.NEXT_PUBLIC_BACKEND_URL!,
);
