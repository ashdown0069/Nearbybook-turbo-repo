"use client"
import type { Book } from "@workspace/types"
import Image from "next/image"
import { Image as ImageIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { useQueryClient } from "@tanstack/react-query"
import { memo, useCallback } from "react"
import { getRegionCookie } from "@/lib/MapCookie"
import { useHoverAction } from "@/hooks/useHoverAction"
import { prefetchBook, PrefetchGetLibsByISBN } from "@workspace/data-access"
import { axiosInstance } from "@/lib/axios"

const BookCard = memo(function BookCard({
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
  }
  const queryClient = useQueryClient()
  const prefetchMap = useCallback(
    async (isbn: string) => {
      //쿠키에 저장된 지역코드 있을 경우 프리페치
      const region = getRegionCookie()
      if (region) {
        await PrefetchGetLibsByISBN(
          axiosInstance,
          queryClient,
          isbn,
          region.region,
          region.dtlRegion
        )
      }
    },
    [queryClient]
  )

  const prefetchBookByISBN = useCallback(
    async (isbn: string) => {
      await prefetchBook(axiosInstance, queryClient, isbn)
    },
    [queryClient]
  )

  const ref = useHoverAction(() => {
    prefetchMap(isbn)
    prefetchBookByISBN(isbn)
  })
  return (
    <>
      <script
        id={`bookJsonLd-${isbn}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <Card className="flex w-full max-w-4xl flex-1 flex-row overflow-hidden rounded-md p-0 transition-all">
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
            <div className="flex h-full w-full flex-col items-center justify-center bg-muted text-muted-foreground">
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
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              <p className="max-w-[150px] truncate">{publisher}</p>
              {publisher && publicationYear && <span>•</span>}
              <span>{publicationYear}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              ISBN - {isbn}
            </div>
          </CardContent>

          <div className="flex justify-end p-4 pt-0">
            <Button
              asChild
              ref={ref}
              variant="secondary"
              className="w-full bg-green-500 py-1 font-bold text-white hover:bg-green-400 sm:w-auto"
            >
              <Link href={`/map?isbn=${isbn}`}>소장 도서관 보기</Link>
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
})

export default BookCard
