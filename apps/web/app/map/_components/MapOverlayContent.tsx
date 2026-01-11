"use client";
import { cn } from "@/lib/utils";
import { Library } from "@repo/types";
import LibInfo from "./LibInfo";
import LoanStatusButton from "./LoanStatusButton";
import { useMedia } from "react-use";
import MapDrawer from "./MapDrawer";
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
        <CardFooter className="flex flex-col items-center justify-center gap-1">
          <CardDescription className="text-xs text-gray-700">
            대출 여부는 조회일 기준 전날의 대출 상태를 확인합니다.
          </CardDescription>
          <CardAction className="w-full">
            <LoanStatusButton isbn={isbn} libCode={libCode} isMobile={false} />
          </CardAction>
        </CardFooter>
      )}
    </Card>
  );
}
