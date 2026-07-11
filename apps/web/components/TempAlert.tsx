"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"
import { getCookie, setCookie } from "cookies-next"

export default function TempAlert() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    async function checkCookie() {
      const isDismissed = await getCookie("hide-temp-alert")
      if (!isDismissed) {
        setIsVisible(true)
      }
    }
    checkCookie()
  }, [])

  const handleDismiss = async () => {
    await setCookie("hide-temp-alert", "true", {
      maxAge: 60 * 60 * 24 * 30, // 30일
      path: "/",
    })
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="relative flex justify-center bg-red-100 px-10 py-3 text-sm text-red-800">
      <span className="text-center">
        현재 대구광역시의 책 소장 도서관 검색 기능은 현재 중지 되었습니다.
        (2026. 07. 10 ~)
      </span>
      <button
        onClick={handleDismiss}
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-red-800 transition-colors hover:text-red-950"
        aria-label="알림 닫기"
      >
        <X size={16} />
      </button>
    </div>
  )
}
