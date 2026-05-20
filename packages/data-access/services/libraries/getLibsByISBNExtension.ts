import { Library } from "@workspace/types";
import type { AxiosInstance } from "axios";

export const getLibsByISBNExtension = async (
  axiosInstance: AxiosInstance,
  isbn: string,
  region: string,
  dtlRegion: string,
  signal?: AbortSignal,
) => {
  const response = await axiosInstance.get<Library[]>(
    "/libraries/searchbyisbn/extension",
    {
      params: {
        isbn: isbn,
        region,
        dtlRegion,
      },
      signal,
    },
  );

  return response.data;
};
