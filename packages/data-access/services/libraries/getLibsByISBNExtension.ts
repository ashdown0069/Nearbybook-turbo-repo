import { Library } from "@repo/types";
import type { AxiosInstance } from "axios";

export const getLibsByISBNExtension = async (
  axiosInstance: AxiosInstance,
  isbn: string,
  region: string,
  dtlRegion: string
) => {
  const response = await axiosInstance.get<Library[]>(
    "/libraries/searchbyisbn/extension",
    {
      params: {
        isbn: isbn,
        region,
        dtlRegion,
      },
    }
  );

  return response.data;
};
