"use client";
import { useGetTrendingBooks } from "@repo/data-access";
import { TrendingUp } from "lucide-react";
import SearchTrendingLink from "./SearchTrendingLink";
import { axiosInstance } from "@/lib/axios";

export default function SearchTrending() {
  const { data, isLoading } = useGetTrendingBooks(axiosInstance);

  if (isLoading) return null;
  return (
    <div className="mx-auto flex max-w-3xl flex-row flex-wrap items-center gap-2">
      <div className="mr-1 flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
        <TrendingUp size={14} /> <span>Trending</span>
      </div>
      {data &&
        data.map((book) => (
          <SearchTrendingLink
            key={book.isbn}
            isbn={book.isbn}
            bookname={book.bookname}
          />
        ))}
    </div>
  );
}
