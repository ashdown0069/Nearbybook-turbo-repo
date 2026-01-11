import { Library } from "@repo/types";
import { keepPreviousData, QueryClient, useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";

export const getLibsByISBN = async (
  axiosInstance: AxiosInstance,
  isbn: string,
  region: string,
  dtlRegion: string
): Promise<Library[]> => {
  return axiosInstance
    .get("/libraries/searchbyisbn", {
      params: {
        isbn,
        region,
        dtlRegion,
      },
    })
    .then((res) => res.data);
};

export const useGetLibsByISBN = (
  axiosInstance: AxiosInstance,
  isbn: string,
  region: string,
  dtlRegion: string
) => {
  return useQuery({
    queryKey: ["search", "location", isbn, region, dtlRegion],
    queryFn: () => getLibsByISBN(axiosInstance, isbn, region, dtlRegion),
    enabled: !!isbn && !!region && !!dtlRegion,
    placeholderData: keepPreviousData,
  });
};

export const PrefetchGetLibsByISBN = async (
  axiosInstance: AxiosInstance,
  queryClient: QueryClient,
  isbn: string,
  region: string,
  dtl_region: string
) => {
  return await queryClient.prefetchQuery({
    queryKey: ["libs", isbn, region, dtl_region],
    queryFn: () => getLibsByISBN(axiosInstance, isbn, region, dtl_region),
  });
};
