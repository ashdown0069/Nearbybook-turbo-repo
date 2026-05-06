import type { AxiosInstance } from "axios";
import type { searchBookLocationResponse } from "@repo/types";

export const searchBookLocation = async (
  axiosInstance: AxiosInstance,
  libCode: string,
  isbn: string,
  signal?: AbortSignal,
): Promise<searchBookLocationResponse> => {
  const res = await axiosInstance.get<searchBookLocationResponse>(
    "/books/searchBookLocation",
    { params: { libCode, isbn }, signal },
  );
  return res.data;
};
