"use client";
import type { Book } from "@repo/types";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getRegionCookie } from "@/lib/MapCookie";
// import { PrefetchGetLibsByISBN } from "@/services/libraries/getLibsByISBN";
// import { prefetchBook } from "@/services/books/searchBook";
import { useHoverAction } from "@/hooks/useHoverAction";
import { prefetchBook, PrefetchGetLibsByISBN } from "@repo/data-access";
import { axiosInstance } from "@/lib/axios";

export default function BookCard({
  authors,
  bookImageURL,
  bookname,
  isbn,
  publicationYear,
  publisher,
  vol,
}: Book) {
  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: bookname,
    isbn: isbn,
    author: {
      "@type": "Person",
      name: authors,
    },
    publisher: {
      "@type": "Organization",
      name: publisher,
    },
    datePublished: publicationYear,
    image: bookImageURL,
    url: `https://nearbybook.kr/map?isbn=${isbn}`,
  };
  const queryClient = useQueryClient();
  const prefetchMap = useCallback(
    async (isbn: string) => {
      //쿠키에 저장된 지역코드 있을 경우 프리페치
      const region = getRegionCookie();
      if (region) {
        await PrefetchGetLibsByISBN(
          axiosInstance,
          queryClient,
          isbn,
          region.region,
          region.dtlRegion,
        );
      }
    },
    [isbn],
  );

  const prefetchBookByISBN = useCallback(
    async (isbn: string) => {
      await prefetchBook(axiosInstance, queryClient, isbn);
    },
    [isbn],
  );

  const ref = useHoverAction(() => {
    prefetchMap(isbn);
    prefetchBookByISBN(isbn);
  });
  return (
    <>
      <script
        id="bookJsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <Card className="flex w-full max-w-4xl flex-1 flex-row overflow-hidden rounded-md p-0 transition-all hover:shadow-md">
        <div className="relative w-24 shrink-0 sm:w-32">
          {vol && (
            <div className="absolute top-2 left-2 z-10 flex size-8 items-center justify-center rounded-full bg-blue-500 text-xs text-white shadow-md">
              {vol}
            </div>
          )}
          {bookImageURL ? (
            <Image
              fill
              src={bookImageURL}
              alt={bookname}
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 640px) 96px, 128px"
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex h-full w-full flex-col items-center justify-center">
              <ImageIcon size={40} />
              <span className="mt-2 text-xs font-medium">No Image</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="line-clamp-2 text-lg leading-tight font-bold">
              {bookname}
            </CardTitle>
            <CardDescription className="line-clamp-1 text-sm">
              {authors}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-xs">
              <p className="max-w-[150px] truncate">{publisher}</p>
              {publisher && publicationYear && <span>•</span>}
              <span>{publicationYear}</span>
            </div>
          </CardContent>

          <CardFooter className="justify-end p-4 pt-0">
            <Button
              asChild
              ref={ref}
              variant="secondary"
              className="w-full bg-green-500 font-bold text-white hover:bg-green-400 sm:w-auto"
            >
              <Link href={`/map?isbn=${isbn}`}>소장 도서관 보기</Link>
            </Button>
          </CardFooter>
        </div>
      </Card>
    </>
  );
}
