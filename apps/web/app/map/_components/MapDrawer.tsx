//mobile only

"use client";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@repo/ui/components/drawer";
import type { Library } from "@repo/types";
import { Bed, BriefcaseBusiness, House, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import BookLoanInfo from "./BookLoanInfo";

export default function MapDrawer({
  libName,
  address,
  homepage,
  closed,
  operatingTime,
  tel,
  hasBook,
  isOpen,
  libCode,
  isbn,
  setIsOpen,
}: Omit<Library, "latitude" | "longitude"> & {
  isbn?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
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
          {hasBook && isbn && <BookLoanInfo isbn={isbn} libCode={libCode} />}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
