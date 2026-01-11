import React from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import MapContainer from "./_components/MapContainer";
import { Book } from "@repo/types";

type Props = {
  searchParams: Promise<{ isbn: string; region?: string; dtl_region?: string }>;
};
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  if (!params.isbn) return {} as Metadata;
  const urlParams = new URLSearchParams({
    mode: "isbn",
    query: params.isbn,
    pageNo: String(1),
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/search?${urlParams.toString()}`,
  );
  const result = await res.json();
  if (!result || result.books.length === 0) {
    return {} as Metadata;
  }

  const book = result.books[0] as Book;
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
  };
}

export default async function MapPage({ searchParams }: Props) {
  const params = await searchParams;
  if (!params.isbn) {
    redirect("/");
  }

  return (
    <MapContainer
      isbn={params.isbn}
      region={params.region}
      dtlRegion={params.dtl_region}
    />
  );
}
