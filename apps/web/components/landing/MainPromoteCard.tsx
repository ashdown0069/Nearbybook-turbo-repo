import Link from "next/link";
import React from "react";
interface MainPromoteCardProps {
  href: string;
  title: React.ReactNode;
  description: React.ReactNode;
  icon: React.ReactNode;
  target?: React.HTMLAttributeAnchorTarget;
}
export default function MainPromoteCard({
  title,
  description,
  href,
  icon,
  target,
}: MainPromoteCardProps) {
  return (
    <Link
      href={href}
      target={target}
      className="group relative block h-full max-w-96 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-green-200 hover:shadow-md"
    >
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-blue-600 transition-colors group-hover:bg-gray-100">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <div className="mt-2 text-sm leading-relaxed text-slate-600">
            {description}
          </div>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-blue-50 opacity-50 blur-3xl transition-all group-hover:bg-blue-100"></div>
    </Link>
  );
}
