"use client";
import Tooltip from "@/components/common/Tooltip";
import type { Library } from "@repo/types";
import { Bed, BriefcaseBusiness, House, Phone } from "lucide-react";
export default function LibInfo({
  libName,
  homepage,
  address,
  closed,
  operatingTime,
  tel,
  libCode,
}: Omit<Library, "hasBook" | "latitude" | "longitude">) {
  return (
    <div className="flex flex-col items-center gap-1 p-3">
      <div className="truncate text-base">{libName}</div>
      <div className="truncate text-xs text-gray-600">{address}</div>
      <div className="flex gap-2 pt-1">
        <Tooltip tooltipText={"홈페이지 열기"}>
          <a href={homepage} target="_blank" rel="noopener noreferrer">
            <House size={24} strokeWidth={1.5} />
          </a>
        </Tooltip>
        <Tooltip tooltipText={tel}>
          <Phone size={24} strokeWidth={1.5} />
        </Tooltip>
        <Tooltip tooltipText={operatingTime}>
          <BriefcaseBusiness size={24} strokeWidth={1.5} />
        </Tooltip>
        <Tooltip tooltipText={closed}>
          <Bed size={24} strokeWidth={1.5} />
        </Tooltip>
      </div>
    </div>
  );
}
