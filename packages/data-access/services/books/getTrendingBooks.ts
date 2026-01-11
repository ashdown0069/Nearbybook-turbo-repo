import type { AxiosInstance } from "axios";
import { type QueryClient, useQuery } from "@tanstack/react-query";

interface TrendingBooksResponse {
  bookname: string;
  isbn: string;
}

export const getTrendingBooks = async (
  axiosInstance: AxiosInstance
): Promise<TrendingBooksResponse[]> => {
  const result = await axiosInstance.get("/books/trending");

  return result.data;
};

export const useGetTrendingBooks = (axiosInstance: AxiosInstance) => {
  return useQuery({
    queryKey: ["trendingBooks"],
    queryFn: () => getTrendingBooks(axiosInstance),
    staleTime: 1000 * 60 * 60, // 1시간
  });
};

export const prefetchGetTrendingBooks = async (
  axiosInstance: AxiosInstance,
  queryClient: QueryClient
) => {
  return await queryClient.prefetchQuery({
    queryKey: ["trendingBooks"],
    queryFn: () => getTrendingBooks(axiosInstance),
  });
};
