import type { AxiosError, AxiosInstance } from "axios";
import {
  type QueryClient,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { Book } from "@repo/types";
const getPopularLoanBooks = async (
  axiosInstance: AxiosInstance
): Promise<Book[]> => {
  return await axiosInstance
    .get("/books/popularloanbooks")
    .then((res) => res.data);
};

type PopularLoanBooksQueryOptions = Omit<
  UseQueryOptions<Book[], AxiosError, Book[], readonly ["popularLoanBooks"]>,
  "queryKey" | "queryFn"
>;

export const useGetPopularLoanBooks = (
  axiosInstance: AxiosInstance,
  options?: PopularLoanBooksQueryOptions
) => {
  return useQuery({
    queryKey: ["popularLoanBooks"],
    queryFn: () => getPopularLoanBooks(axiosInstance),
    ...options,
  });
};

export const prefetchPopularLoanBooks = async (
  axiosInstance: AxiosInstance,
  queryClient: QueryClient
) => {
  return await queryClient.prefetchQuery({
    queryKey: ["popularLoanBooks"],
    queryFn: () => getPopularLoanBooks(axiosInstance),
  });
};
