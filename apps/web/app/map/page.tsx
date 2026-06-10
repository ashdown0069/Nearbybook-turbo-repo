import React from "react"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import MapContainer from "./_components/MapContainer"
import { Book } from "@workspace/types"

type Props = {
  searchParams: Promise<{ isbn: string; region?: string; dtl_region?: string }>
}
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams
  if (!params.isbn) return {} as Metadata

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/search/${params.isbn}`
    )

    if (!res.ok) {
      throw new Error(`API fetch failed with status: ${res.status}`)
    }

    const result = await res.json()
    if (!result?.bookname) {
      console.warn("generateMetadata: No book found for ISBN")
      return {} as Metadata
    }

    const book = result as Book

    return {
      title: `${book.bookname} | 내 주변 도서관 찾기`,
      description: `${book.bookname}(저자: ${book.authors})을(를) 소장한 내 주변 공공 도서관 위치를 확인해보세요.`,
      openGraph: {
        title: book.bookname,
        description: `${book.bookname} 찾아보기`,
        images: [
          {
            url: book.bookImageURL || "",
            width: 200,
            height: 300,
            alt: book.bookname,
          },
        ],
      },
    }
  } catch (error) {
    console.error("generateMetadata Error:", error)
    return {} as Metadata
  }
}

export default async function MapPage({ searchParams }: Props) {
  const params = await searchParams
  if (!params.isbn) {
    redirect("/")
  }

  return (
    <MapContainer
      isbn={params.isbn}
      region={params.region}
      dtlRegion={params.dtl_region}
    />
  )
}
