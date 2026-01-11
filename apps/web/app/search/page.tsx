import React from "react";
import Search from "@/app/search/_components/Search";
import NotFoundBooks from "./_components/NotFoundBooks";
import ExtensionPromotion from "@/components/common/ExtensionPromotion";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
// import SearchResult from "./_components/SearchResult";
const SearchResult = dynamic(() => import("./_components/SearchResult"));
// import { PrefetchSearchBooks } from "@/services/books/searchBooks";
import SearchTrending from "./_components/SearchTrending/SearchTrending";
// import { prefetchGetTrendingBooks } from "@/services/books/getTrendingBooks";
import Logo from "@/components/common/Logo";
import { Metadata } from "next";
import {
  prefetchGetTrendingBooks,
  PrefetchSearchBooks,
} from "@repo/data-access";
import { axiosInstance } from "@/lib/axios";

type Props = {
  searchParams: Promise<{
    mode: "title" | "isbn";
    query: string;
    pageNo: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const { query } = params;

  if (query) {
    const decodedQuery = decodeURIComponent(query);
    return {
      title: `${decodedQuery} 검색 결과`,
      description: `'${decodedQuery}'에 대한 도서 검색 결과입니다. 주변 도서관 소장 여부를 확인해보세요.`,
      openGraph: {
        title: `${decodedQuery} 검색 결과 | Nearby Books`,
        description: `'${decodedQuery}' 주변 도서관 소장 여부 확인하기`,
      },
      alternates: {
        canonical: `/search?query=${query}`,
      },

      keywords: [
        "도서관",
        "책",
        "도서",
        "공공 도서관",
        "책 소장 도서관 찾기",
        "ISBN 검색",
        "도서 검색",
        "도서관 위치",
      ],
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
        },
      },
    };
  }

  return {
    title: "도서 검색",
    description:
      "찾고 싶은 책을 검색하고 주변 도서관 대출 가능 여부를 확인하세요.",
    alternates: {
      canonical: "/search",
    },
    keywords: [
      "도서관",
      "책",
      "도서",
      "공공 도서관",
      "책 소장 도서관 찾기",
      "ISBN 검색",
      "도서 검색",
      "도서관 위치",
    ],
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

//query, pageNo, mode
export default async function SearchResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const queryClient = new QueryClient();

  // 1. 초기 화면/검색 결과 화면 모두 Trending Books 프리패치
  await prefetchGetTrendingBooks(axiosInstance, queryClient);

  const hasQueryParams = params.query && params.mode && params.pageNo;

  // 2. 검색 조건이 있을 때만 검색 결과 프리패치
  if (hasQueryParams) {
    const { query, mode, pageNo } = params;
    await PrefetchSearchBooks(axiosInstance, queryClient, mode, query, pageNo);
  }

  return (
    <main className="">
      <HydrationBoundary state={dehydrate(queryClient)}>
        {!hasQueryParams ? (
          // 초기 화면 (검색어 없음)
          <section className="flex min-h-screen flex-col items-center justify-baseline gap-3 p-3 md:p-5 lg:p-10">
            <div className="flex w-full items-center justify-center gap-3">
              <Logo className="pb-5" />
              <Search />
            </div>

            <SearchTrending />
            <ExtensionPromotion />
            <NotFoundBooks />
          </section>
        ) : (
          // 검색 결과 화면
          <SearchResult
            query={params.query as string}
            mode={params.mode as "title" | "isbn"}
            pageNo={+params.pageNo}
          />
        )}
      </HydrationBoundary>
    </main>
  );
}
