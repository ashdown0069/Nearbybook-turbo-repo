"use client";

import { useSearchBooks } from "@repo/data-access";
import SearchSummary from "./SearchSummary";
import Search from "@/app/search/_components/Search";
import PaginationWithIcon from "./Pagination";
import { usePathname, useSearchParams } from "next/navigation";
import NotFoundBooks from "./NotFoundBooks";
import { cn } from "@/lib/utils";
import ExtensionPromotion from "@/components/common/ExtensionPromotion";
import BookCard from "./BookCard";
import Logo from "@/components/common/Logo";
import { useCallback } from "react";
import LoadingScreen from "@/components/Loading";
import ErrorScreen from "@/components/Error";
import { axiosInstance } from "@/lib/axios";

export default function SearchResult({
  mode,
  pageNo,
  query,
}: {
  query: string;
  mode: "title" | "isbn";
  pageNo: number;
}) {
  const pathname = usePathname(); // 현재 경로 가져오기
  const searchParams = useSearchParams();
  const {
    data: booksData,
    isLoading: isBooksLoading,
    isError: isBooksError,
    refetch: refetchBook,
  } = useSearchBooks(axiosInstance, mode, query, pageNo);

  const createPageUrl = useCallback(
    (currentPage: number) => {
      //pagination
      const params = new URLSearchParams(searchParams.toString());
      params.set("pageNo", currentPage.toString());
      const url = `${pathname}?${params.toString()}`;
      return url;
    },
    [searchParams, pathname],
  );

  if (isBooksLoading) {
    return <LoadingScreen />;
  }

  if (isBooksError) {
    return (
      <ErrorScreen
        resetErrorBoundary={() => {
          refetchBook();
        }}
      />
    );
  }
  return (
    <section className="flex min-h-screen flex-col items-center p-3 md:p-5 lg:p-10">
      <div className="flex w-full items-center justify-center gap-3">
        <Logo className="pb-5" />
        <Search />
      </div>
      <ExtensionPromotion />
      {booksData && booksData.numFound > 0 && (
        <SearchSummary numFound={booksData.numFound} />
      )}
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center gap-4 px-4",
          booksData?.numFound === 0 && "flex items-center justify-center",
        )}
      >
        {booksData && booksData.numFound === 0 && (
          <NotFoundBooks title={query} />
        )}
        {booksData &&
          booksData.numFound > 0 &&
          booksData.books.map((book) => (
            <BookCard
              key={book.isbn}
              {...book}
              bookImageURL={book.bookImageURL}
            />
          ))}
      </div>
      {booksData && booksData.pages > 1 && (
        <PaginationWithIcon
          createPageUrl={createPageUrl}
          currentPage={pageNo}
          totalPages={booksData.pages}
        />
      )}
    </section>
  );
}
