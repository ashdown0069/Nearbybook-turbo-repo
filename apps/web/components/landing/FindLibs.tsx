import Link from "next/link";
import React from "react";
import MainPromoteCard from "./MainPromoteCard";
import { MapPin } from "lucide-react";

export default function FindLibs() {
  return (
    <MainPromoteCard
      href="/map/libs"
      icon={<MapPin />}
      title="내 주변 도서관 찾기"
      description={` 지도 위에서 내 위치 주변의 도서관들을${"\n"} 한눈에 확인하고 대출 가능 여부를 알아보세요.`}
    />
  );
}
