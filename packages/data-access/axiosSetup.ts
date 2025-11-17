import axios from "axios";

export const createAxiosInstance = (baseURL: string) => {
  return axios.create({
    baseURL: `${baseURL}/`,
    timeout: 5000,
    maxRedirects: 3,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
