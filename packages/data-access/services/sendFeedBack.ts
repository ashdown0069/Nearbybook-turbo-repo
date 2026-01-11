import type { AxiosInstance } from "axios";

export const sendFeedback = async (
  axiosInstance: AxiosInstance,
  title: string,
  description: string,
  email?: string
) => {
  const response = await axiosInstance.post("/feedback", {
    title: title,
    description: description,
    ...(email && { email: email }),
  });

  return response.data;
};
