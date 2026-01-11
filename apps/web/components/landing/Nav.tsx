import React from "react";
import Logo from "../common/Logo";
import Link from "next/link";
import { Library, Search } from "lucide-react";

export default function Nav() {
  return (
    <nav className="flex bg-gray-50 p-3 sm:p-5 lg:p-8">
      <Logo />
      <ul className="ml-5 flex items-center justify-center gap-4 text-base">
        <li>
          <Link
            href={"/search"}
            className="group relative flex items-center gap-2 py-2 text-xs font-medium text-slate-800 transition-colors duration-300 hover:text-green-600 sm:text-sm"
          >
            <Search
              size={18}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
            <span>책 검색하기</span>

            {/* Underline Animation: Grows from left to right */}
            <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-green-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </Link>
        </li>
        <li>
          <Link
            href={"/map/libs"}
            className="group relative flex items-center gap-2 py-2 text-xs font-medium text-slate-800 transition-colors duration-300 hover:text-green-600 sm:text-sm"
          >
            <Library
              size={18}
              // color="#7bf1a8"
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
            <span>도서관 찾기</span>
            <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-green-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
