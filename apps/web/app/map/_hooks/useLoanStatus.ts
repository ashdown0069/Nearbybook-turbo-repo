"use client";

import { axiosInstance } from "@/lib/axios";
import { useLoanStatusStore } from "@/store/useLoanStatusStore";
import { getBookLoanStatus } from "@repo/data-access";
import { useCallback } from "react";

export function useLoanStatus(isbn: string, libCode: string) {
  const { statuses, setLoanStatus } = useLoanStatusStore();
  const cacheKey = `${isbn}-${libCode}`;
  const status = statuses[cacheKey] || "idle";

  const checkLoanStatus = useCallback(async () => {
    if (status !== "idle") return;

    try {
      setLoanStatus(isbn, libCode, "loading");
      const result = await getBookLoanStatus(axiosInstance, isbn, libCode);

      if (result.loanAvailable === "Y") {
        setLoanStatus(isbn, libCode, "canLoan");
      } else if (result.loanAvailable === "N") {
        setLoanStatus(isbn, libCode, "cannotLoan");
      } else {
        // API 응답에 loanAvailable 필드가 없는 경우 등 예외 처리
        setLoanStatus(isbn, libCode, "error");
      }
    } catch (error) {
      setLoanStatus(isbn, libCode, "error");
    }
  }, [status, isbn, libCode, setLoanStatus]);

  return { status, checkLoanStatus };
}
