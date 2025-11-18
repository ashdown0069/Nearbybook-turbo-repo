import { createAxiosInstance } from "@repo/data-access";
// const baseURL = "http://localhost:4001";
const baseURL = "http://172.30.1.68:4001";
export const axiosInstance = createAxiosInstance(baseURL);
