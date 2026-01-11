//mobile only

"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/drawer";
import type { Library } from "@repo/types";
import { Bed, BriefcaseBusiness, House, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import LoanStatusButton from "./LoanStatusButton";

export default function MapDrawer({
  libName,
  address,
  homepage,
  closed,
  operatingTime,
  tel,
  hasBook,
  children,
  isOpen,
  libCode,
  isbn,
  setIsOpen,
}: Omit<Library, "latitude" | "longitude"> & {
  isbn?: string;
  children?: React.ReactNode;
  loanStatusComponent?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    setIsOpen(true);
  }, []);
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {/* <DrawerTrigger>{children}</DrawerTrigger> */}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{libName}</DrawerTitle>
          <DrawerDescription>{address}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-3 text-sm">
          <Link
            href={homepage}
            className="flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <House size={16} strokeWidth={1.5} />
            <p className="truncate">{homepage}</p>
          </Link>
          <div className="flex items-center gap-1">
            <Phone size={16} strokeWidth={1.5} />
            <p className="truncate"> {tel}</p>
          </div>
          <div className="flex items-center gap-1">
            <BriefcaseBusiness size={16} strokeWidth={1.5} />
            <p className="truncate">{operatingTime}</p>
          </div>
          <div className="flex items-center gap-1">
            <Bed size={16} strokeWidth={1.5} />
            <p className="truncate">{closed}</p>
          </div>
        </div>
        <DrawerFooter className="pb-8">
          {hasBook && isbn && (
            <>
              <LoanStatusButton isbn={isbn} libCode={libCode} isMobile />{" "}
              <p className="text-center text-xs text-gray-700">
                대출 여부는 조회일 기준 전날의 대출 상태를 확인합니다.
              </p>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
