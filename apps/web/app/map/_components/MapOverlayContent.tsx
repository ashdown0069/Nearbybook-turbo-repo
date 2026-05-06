"use client";
import { cn } from "@/lib/utils";
import { Library } from "@repo/types";
import LibInfo from "./LibInfo";
import BookLoanInfo from "./BookLoanInfo";
import { useMedia } from "react-use";
import MapDrawer from "./MapDrawer";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@repo/ui/components/card";
export default function MapOverlayContent({
  libName,
  homepage,
  address,
  closed,
  operatingTime,
  tel,
  libCode,
  isbn,
  hasBook,
}: Library & { isbn?: string }) {
  const isWide = useMedia("(min-width: 480px)");
  const [isOpen, setIsOpen] = useState(false);

  if (!isWide) {
    return (
      <MapDrawer
        isbn={isbn}
        libName={libName}
        libCode={libCode}
        address={address}
        homepage={homepage}
        closed={closed}
        operatingTime={operatingTime}
        tel={tel}
        hasBook={hasBook}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    );
  }
  return (
    <Card
      className={cn(
        "flex min-w-96 flex-col items-center justify-center gap-1 rounded-md bg-white py-3 shadow-2xl",
        !hasBook && "h-36",
      )}
    >
      <CardContent>
        <LibInfo
          libName={libName}
          homepage={homepage}
          address={address}
          closed={closed}
          operatingTime={operatingTime}
          tel={tel}
          libCode={libCode}
        />
      </CardContent>
      {hasBook && isbn && (
        <CardFooter className="flex flex-col items-center justify-center gap-1 px-4">
          <BookLoanInfo isbn={isbn} libCode={libCode} />
        </CardFooter>
      )}
    </Card>
  );
}
