import BrowserExtension from "@/components/landing/BrowserExtension";
import FindLibs from "@/components/landing/FindLibs";
import PopularBooks from "@/components/landing/PopularBooks";
import Search from "@/app/search/_components/Search";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Info } from "lucide-react";
import { prefetchPopularLoanBooks } from "@repo/data-access";
import Nav from "@/components/landing/Nav";
import SearchTrending from "./search/_components/SearchTrending/SearchTrending";
import { prefetchGetTrendingBooks } from "@repo/data-access";
import Footer from "@/components/landing/Footer";
import { axiosInstance } from "@/lib/axios";

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.allSettled([
    prefetchPopularLoanBooks(axiosInstance, queryClient),
    prefetchGetTrendingBooks(axiosInstance, queryClient),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nearby Books",
    url: "https://nearbybook.kr",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://nearbybook.kr/search?mode=title&query={search_term_string}&pageNo=1",
      },
      "query-input": "required name=search_term_string",
    },
    description: "집 근처 공공 도서관에서 읽고 싶은 책을 찾아보세요.",
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 px-3 py-8 sm:p-6 lg:p-8 lg:py-16">
        <h1 className="mb-4 text-center text-xl/10 font-bold tracking-tight text-slate-900 sm:text-4xl/12 lg:text-5xl/16">
          우리 동네 도서관에 <br className="hidden sm:block" />
          <span className="text-green-600">읽고 싶은 책</span>이 있을까요?
        </h1>
        <h2 className="mb-8 text-center text-sm text-slate-600 sm:text-base xl:text-lg">
          찾으시는 책의 제목이나 ISBN을 입력하세요. 주변 공공도서관의 소장
          여부를 즉시 확인해 드립니다.
        </h2>
        <Search />
        <div className="mb-5 flex items-center justify-baseline gap-2 text-sm text-slate-400 xl:text-base">
          <Info className="size-3 sm:size-4" />
          <p>ISBN 13자리 검색 시 가장 정확합니다.</p>
        </div>
        <SearchTrending />
        <div className="mt-5 grid grid-cols-1 gap-4 py-8 md:grid-cols-2 lg:mt-10">
          <FindLibs />
          <BrowserExtension />
        </div>
        <PopularBooks />
        <Footer />
      </main>
    </HydrationBoundary>
  );
}
