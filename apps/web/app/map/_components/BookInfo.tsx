"use client";
import type { Book } from "@repo/types";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function BookInfo({ book }: { book: Book }) {
  return (
    <div className="flex items-start gap-4 pb-1">
      {book.bookImageURL ? (
        <Image
          src={book.bookImageURL}
          alt={book.bookname}
          width={100}
          height={100}
          className="aspect-2/3 h-auto w-[100px] shrink-0 rounded-md shadow-md"
        />
      ) : (
        <div className="flex aspect-2/3 h-auto w-[100px] shrink-0 flex-col items-center justify-center rounded-md bg-gray-200">
          <ImageIcon className="h-10 w-10 text-gray-400" />
          <p className="mt-1 text-xs font-semibold text-gray-500">No Image</p>
        </div>
      )}
      <div className="flex flex-col gap-1 pt-1">
        <h2 className="text-lg font-bold text-gray-800">
          {book.bookname} {book.vol ? `[${book.vol}]` : ""}
        </h2>
        <p className="text-sm text-gray-600">{book.authors}</p>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>{book.publisher}</span>
          <span>{book.publicationYear}</span>
        </div>
        <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
      </div>
    </div>
  );
}
