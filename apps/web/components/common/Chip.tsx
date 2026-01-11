import Tooltip from "@/components/common/Tooltip";
import { Hash } from "lucide-react";
import React from "react";

export default function Chip({ label }: { label: string }) {
  return (
    <Tooltip tooltipText={label}>
      <div className="group flex max-w-40 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 transition-all duration-200 ease-in-out hover:border-green-400 hover:bg-green-50 hover:text-green-600 focus:ring-2 focus:ring-green-500/20 focus:outline-none active:scale-95">
        <span className="text-slate-400 transition-colors group-hover:text-green-500">
          <Hash size={12} />
        </span>
        <span className="truncate pb-0.5 text-xs">{label}</span>
      </div>
    </Tooltip>
  );
}
