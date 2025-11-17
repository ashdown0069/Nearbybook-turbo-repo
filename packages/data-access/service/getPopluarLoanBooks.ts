import type { AxiosError, AxiosInstance } from "axios";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { Book } from "@repo/types";
const getPopularLoanBooks = async (
  instance: AxiosInstance
): Promise<Book[]> => {
  return await instance.get("/popularloanbooks").then((res) => res.data);
};

type PopularLoanBooksQueryOptions = Omit<
  UseQueryOptions<Book[], AxiosError, Book[], readonly ["popularLoanBooks"]>,
  "queryKey" | "queryFn"
>;

export const useGetPopularLoanBooks = (
  instance: AxiosInstance,
  options?: PopularLoanBooksQueryOptions
) => {
  return useQuery({
    queryKey: ["popularLoanBooks"],
    queryFn: () => getPopularLoanBooks(instance),
    ...options,
  });
};
