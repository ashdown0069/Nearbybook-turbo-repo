"use client"

import { axiosInstance } from "@/lib/axios"
import { useBookInfoStore } from "@/store/useBookInfoStore"
import { getBookLoanStatus, searchBookLocation } from "@workspace/data-access"
import { useEffect } from "react"

export function useBookInfo(isbn: string, libCode: string) {
  const { entries, setLoanStatus, setLocation, setLocationLoading } =
    useBookInfoStore()
  const cacheKey = `${isbn}-${libCode}`
  const entry = entries[cacheKey]

  useEffect(() => {
    if (!isbn || !libCode) return
    if (entry?.loanStatus !== undefined && entry.loanStatus !== "idle") return

    const fetchAll = async () => {
      setLoanStatus(isbn, libCode, "loading")
      setLocationLoading(isbn, libCode, true)

      const [loanResult, locationResult] = await Promise.allSettled([
        getBookLoanStatus(axiosInstance, isbn, libCode),
        searchBookLocation(axiosInstance, libCode, isbn),
      ])

      if (loanResult.status === "fulfilled") {
        setLoanStatus(
          isbn,
          libCode,
          loanResult.value.loanAvailable === "Y" ? "canLoan" : "cannotLoan"
        )
      } else {
        setLoanStatus(isbn, libCode, "error")
      }

      if (
        locationResult.status === "fulfilled" &&
        locationResult.value.hasBook
      ) {
        setLocation(isbn, libCode, {
          shelfLocation: locationResult.value.shelfLocation,
          bookCode: locationResult.value.bookCode,
        })
      } else {
        setLocation(isbn, libCode, null)
      }
      setLocationLoading(isbn, libCode, false)
    }

    fetchAll()
  }, [
    isbn,
    libCode,
    entry?.loanStatus,
    setLoanStatus,
    setLocation,
    setLocationLoading,
  ])

  return {
    loanStatus: entry?.loanStatus ?? "idle",
    location: entry?.location ?? null,
    locationLoading: entry?.locationLoading ?? false,
  }
}
