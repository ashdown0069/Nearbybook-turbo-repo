import Chip from "@/components/common/Chip";
import { PrefetchSearchBooks } from "@repo/data-access";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useCallback } from "react";
import { useHoverAction } from "@/hooks/useHoverAction";
import { axiosInstance } from "@/lib/axios";
export default function SearchTrendingLink({
  isbn,
  bookname,
}: {
  isbn: string;
  bookname: string;
}) {
  const queryClient = useQueryClient();
  const prefetchBook = useCallback(
    async () =>
      await PrefetchSearchBooks(axiosInstance, queryClient, "isbn", isbn, "1"),
    [],
  );

  const ref = useHoverAction(prefetchBook);
  return (
    <Link
      ref={ref}
      key={isbn}
      href={`/search?mode=isbn&query=${isbn}&pageNo=1`}
    >
      <Chip label={bookname} />
    </Link>
  );
}
