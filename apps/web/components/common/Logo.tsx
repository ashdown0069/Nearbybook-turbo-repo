import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo({
  width = 100,
  height = 50,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Link
      href={"/"}
      className={cn("flex size-auto items-center justify-center", className)}
    >
      <Image src={"/logo.png"} width={width} height={height} alt="logo" />
    </Link>
  );
}
