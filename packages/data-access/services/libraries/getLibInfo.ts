import { Library } from "@workspace/types";
import type { AxiosInstance } from "axios";

//extension에서 도서관 코드로 도서관 정보 가져오기용
export const getLibInfo = async (
  axiosInstance: AxiosInstance,
  libCode: string,
  signal?: AbortSignal,
) => {
  const response = await axiosInstance.get<Library>("/libraries/getLibInfo", {
    params: {
      libCode,
    },
    signal,
  });

  return response.data;
};
