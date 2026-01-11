import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import React from "react";
import { Book } from "@repo/types";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export default function MyBook(book: Book) {
  return (
    <Card className="group flex h-full w-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-3/4 w-full">
        {book.bookImageURL ? (
          <Image src={book.bookImageURL} fill alt={`${book.bookname} image`} />
        ) : (
          <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center border">
            <ImageIcon size={30} />
            <span className="mt-2 text-xs font-medium">No Image</span>
          </div>
        )}
      </div>
      <CardContent className="text-sm">
        <div className="pb-1 font-semibold">{book.bookname}</div>
        <div className="text-muted-foreground flex flex-col">
          <div>{book.authors}</div>
          <div>{book.publicationYear}</div>
        </div>
      </CardContent>
    </Card>
  );
}
