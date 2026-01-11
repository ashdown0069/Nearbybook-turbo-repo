"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@/lib/utils";
import { BookCheck, BookX, CircleX, Hand, Loader } from "lucide-react";
import { useLoanStatus } from "../_hooks/useLoanStatus";

interface LoanStatusButtonProps {
  isbn: string;
  libCode: string;
  isMobile: boolean;
}

const statusConfig = {
  idle: {
    Icon: Hand,
    text: "대출 여부 조회 하기",
    className: "bg-indigo-500 text-white hover:bg-indigo-500",
  },
  loading: {
    Icon: Loader,
    text: "로딩 중...",
    className: "bg-gray-400 text-white cursor-wait hover:bg-gray-400",
  },
  canLoan: {
    Icon: BookCheck,
    text: "대출 가능",
    className: "bg-green-500 text-white hover:bg-green-500",
  },
  cannotLoan: {
    Icon: BookX,
    text: "대출 불가",
    className: "bg-red-500 text-white hover:bg-red-500",
  },
  error: {
    Icon: CircleX,
    text: "오류가 발생했습니다.",
    className: "bg-red-500 text-white text-xs hover:bg-red-500",
  },
};

export default function LoanStatusButton({
  isbn,
  libCode,
  isMobile,
}: LoanStatusButtonProps) {
  const { status, checkLoanStatus } = useLoanStatus(isbn, libCode);
  const { Icon, text, className } = statusConfig[status];

  return (
    <Button
      onClick={checkLoanStatus}
      disabled={status !== "idle"}
      variant={"outline"}
      asChild
      className={cn(
        "w-full cursor-pointer hover:text-white",
        isMobile && "rounded-md",
      )}
    >
      <div
        className={cn("flex items-center justify-center gap-2 py-5", className)}
      >
        <Icon
          className={cn(status === "loading" && "animate-spin")}
          size={status === "error" ? 24 : undefined}
        />
        {text}
      </div>
    </Button>
  );
}
