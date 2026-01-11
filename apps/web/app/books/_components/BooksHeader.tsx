import { BookMarked } from "lucide-react";
import { Span } from "next/dist/trace";
import React from "react";

export default function BooksHeader({ booksCount }: { booksCount: number }) {
  return (
    <div className="flex items-center gap-3 p-3 lg:p-5">
      <div className="rounded-xl bg-gray-100 p-3">
        <BookMarked color="#008236" className="size-7 lg:size-10" />
      </div>
      <div>
        <h1 className="text-xl lg:text-2xl">내가 저장한 책</h1>
        <div className="text-green text-xs text-gray-600 lg:text-sm">
          {booksCount > 0 && (
            <p>
              나만의 서재에 <span className="text-green-700">{booksCount}</span>
              권의 도서가 있습니다.
            </p>
          )}
          {booksCount === 0 && <p>저장 된 책이 없습니다.</p>}
        </div>
      </div>
    </div>
  );
}
