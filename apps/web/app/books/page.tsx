import React from "react";
import { Book } from "@repo/types";

const BookMock = {
  authors: "test author",
  bookImageURL: "",
  bookname: "test bookname",
  isbn: "test isbn",
  publicationYear: "test publicationYear",
  publisher: "test publisher",
  vol: "test vol",
} as Book;

export default function page() {
  return (
    <div>
      {/* <BooksHeader booksCount={3} />
      <Separator />
      <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 md:grid-cols-3 md:p-6 lg:grid-cols-5 lg:p-8">
        <MyBook {...BookMock} />
      </div> */}
    </div>
  );
}
