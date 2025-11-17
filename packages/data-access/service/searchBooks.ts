import { BookList } from "@repo/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";

export const getBooks = (
  axiosInstance: AxiosInstance,
  query: string,
  pageNo: number
): Promise<BookList> => {
  return axiosInstance
    .get("/searchbooks", {
      params: {
        mode: "title",
        query: query,
        pageNo: pageNo,
      },
    })
    .then((res) => res.data);
};
export const useSearchBooksByTitle = (
  instance: AxiosInstance,
  query: string
) => {
  return useInfiniteQuery({
    queryKey: ["search", "title", query],
    queryFn: ({ pageParam }) => getBooks(instance, query, pageParam as number),
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

export const useSearchBooksByISBN = (
  instance: AxiosInstance,
  query: string,
  pageNo: number
) => {
  return useQuery({
    queryKey: ["search", "isbn", query],
    queryFn: () => getBooks(instance, query, pageNo),
    enabled: !!query,
  });
};
