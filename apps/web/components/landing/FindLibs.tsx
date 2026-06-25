"use client"
import React from "react"
import MainPromoteCard from "./MainPromoteCard"
import { MapPin } from "lucide-react"
import { useMedia } from "react-use"

export default function FindLibs() {
  const isMobile = useMedia("(max-width: 768px)", true)

  //모바일 환경에서는 표시하지 않음
  if (isMobile) {
    return null
  }
  return (
    <MainPromoteCard
      href="/map/libs"
      icon={<MapPin />}
      title="내 주변 도서관 찾기"
      description={` 지도 위에서 내 위치 주변의 도서관들을${"\n"} 한눈에 확인하고 대출 가능 여부를 알아보세요.`}
    />
  )
}
