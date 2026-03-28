import { useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export const getAutoCompleteResult = async (
  axiosInstance: AxiosInstance,
  query: string,
  mode?: "title" | "isbn",
) => {
  return axiosInstance
    .get("/books/autocomplete", {
      params: {
        query: query,
        ...(mode && { mode }),
      },
    })
    .then((res) => res.data);
};

export const useGetAutoCompleteResult = (
  axiosInstance: AxiosInstance,
  query: string,
  mode?: "title" | "isbn",
) => {
  return useQuery({
    queryKey: ["autocomplete", query, mode],
    queryFn: () => getAutoCompleteResult(axiosInstance, query, mode),
    enabled: !!query,
  });
};
