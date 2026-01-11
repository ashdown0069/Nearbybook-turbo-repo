"use client";

import BookCard from "@/app/search/_components/BookCard";
import { axiosInstance } from "@/lib/axios";
import { useGetPopularLoanBooks } from "@repo/data-access";

export default function PopularBooks() {
  const { data, isLoading, isError } = useGetPopularLoanBooks(axiosInstance);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex w-full flex-col justify-start">
      <h3 className="py-7 pl-4 text-left font-semibold sm:text-xl">
        ⭐ 인기 대출 도서
      </h3>
      <div className="flex w-full flex-col items-center justify-center gap-4 px-4">
        {data && data.map((book, idx) => <BookCard key={idx} {...book} />)}
      </div>
    </section>
  );
}
