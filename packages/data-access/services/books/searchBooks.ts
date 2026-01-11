import { BookList } from "@repo/types";
import {
  keepPreviousData,
  QueryClient,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import type { AxiosInstance } from "axios";

export const searchBooks = async (
  axiosInstance: AxiosInstance,
  query: string,
  pageNo: number,
  mode: "title" | "isbn" = "title"
): Promise<BookList> => {
  return axiosInstance
    .get("/books/search", {
      params: {
        mode: mode,
        query: query,
        pageNo: pageNo,
      },
    })
    .then((res) => res.data);
};

//react-native 용 무한스크롤 훅
export const useSearchBooksByTitle = (
  instance: AxiosInstance,
  query: string
) => {
  return useInfiniteQuery({
    queryKey: ["search", "title", query],
    queryFn: ({ pageParam }) =>
      searchBooks(instance, query, pageParam as number, "title"),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // 현재 페이지 번호가 전체 페이지 수보다 작으면 다음 페이지 번호를 반환합니다.
      if ((lastPageParam as number) < lastPage.pages) {
        return (lastPageParam as number) + 1;
      }
      // 다음 페이지가 없으면 undefined를 반환
      return undefined;
    },
    enabled: !!query,
  });
};

export const useSearchBooks = (
  axiosInstance: AxiosInstance,
  mode: "title" | "isbn",
  query: string,
  pageNo: number
) => {
  return useQuery({
    queryKey: ["books", query, mode, +pageNo],
    queryFn: () => searchBooks(axiosInstance, query, +pageNo, mode),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });
};

export const PrefetchSearchBooks = async (
  axiosInstance: AxiosInstance,
  queryClient: QueryClient,
  mode: "title" | "isbn",
  query: string,
  pageNo: string
) => {
  return await queryClient.prefetchQuery({
    queryKey: ["books", query, mode, +pageNo],
    queryFn: () => searchBooks(axiosInstance, query, +pageNo, mode),
  });
};
