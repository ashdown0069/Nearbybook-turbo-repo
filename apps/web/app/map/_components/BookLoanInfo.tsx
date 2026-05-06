"use client";

import { useBookInfo } from "../_hooks/useBookInfo";
import { Loader } from "lucide-react";

interface BookLoanInfoProps {
  isbn: string;
  libCode: string;
}

export default function BookLoanInfo({ isbn, libCode }: BookLoanInfoProps) {
  const { loanStatus, location, locationLoading } = useBookInfo(isbn, libCode);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">대출 여부</span>
        <LoanBadge status={loanStatus} />
      </div>

      {locationLoading ? (
        <div className="flex items-center justify-center gap-1 py-1 text-xs text-gray-400">
          <Loader size={12} className="animate-spin" />
          위치 조회 중...
        </div>
      ) : location ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          {location.shelfLocation && (
            <>
              <dt className="text-xs text-gray-400">자료실</dt>
              <dd className="text-sm text-gray-700">
                {location.shelfLocation}
              </dd>
            </>
          )}
          {location.bookCode && (
            <>
              <dt className="text-xs text-gray-400">청구기호</dt>
              <dd className="font-mono text-sm text-gray-700">
                {location.bookCode}
              </dd>
            </>
          )}
        </dl>
      ) : null}

      <p className="text-center text-xs text-gray-400">
        대출 여부는 조회일 기준 전날의 대출 상태를 확인합니다.
      </p>
    </div>
  );
}

function LoanBadge({
  status,
}: {
  status: "idle" | "loading" | "error" | "canLoan" | "cannotLoan";
}) {
  switch (status) {
    case "idle":
    case "loading":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
          <Loader size={10} className="animate-spin" />
          조회 중
        </span>
      );
    case "canLoan":
      return (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          대출 가능
        </span>
      );
    case "cannotLoan":
      return (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          대출 중
        </span>
      );
    case "error":
      return (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
          조회 실패
        </span>
      );
  }
}
