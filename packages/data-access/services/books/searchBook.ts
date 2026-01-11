import type { AxiosInstance } from "axios";
import { keepPreviousData, QueryClient, useQuery } from "@tanstack/react-query";
import { Book } from "@repo/types";

export const searchBook = async (
  axiosInstance: AxiosInstance,
  isbn: string
): Promise<Book> => {
  const response = await axiosInstance.get(`/books/search/${isbn}`);

  return response.data;
};

export const useSearchBook = (axiosInstance: AxiosInstance, isbn: string) => {
  return useQuery({
    queryKey: ["book", isbn],
    queryFn: () => searchBook(axiosInstance, isbn),
    enabled: !!isbn,
    placeholderData: keepPreviousData,
  });
};

export const prefetchBook = async (
  axiosInstance: AxiosInstance,
  queryClient: QueryClient,
  isbn: string
) => {
  return await queryClient.prefetchQuery({
    queryKey: ["book", isbn],
    queryFn: () => searchBook(axiosInstance, isbn),
  });
};
