import { MessageSquareText } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Feedback() {
  return (
    <Link
      href="/feedback"
      className="flex w-full items-center gap-2 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition-all hover:bg-gray-100 hover:shadow-md"
    >
      <MessageSquareText className="h-4 w-4 text-gray-500" />
      <span>서비스 개선을 위한 의견을 남겨주세요</span>
    </Link>
  );
}
