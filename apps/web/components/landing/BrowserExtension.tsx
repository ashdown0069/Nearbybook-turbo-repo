"use client"
import { Puzzle } from "lucide-react"
import MainPromoteCard from "./MainPromoteCard"
import { useMedia, useMountedState } from "react-use"

export default function BrowserExtension() {
  const isMounted = useMountedState()

  const extensionStoreUrl =
    isMounted() &&
    typeof window !== "undefined" &&
    window.navigator.userAgent.includes("Whale")
      ? process.env.NEXT_PUBLIC_EXTENSION_WHALE_STORE_URL
      : process.env.NEXT_PUBLIC_EXTENSION_STORE_URL

  const isMobile = useMedia("(max-width: 768px)", true)

  //모바일 환경의 경우 확장 프로그램 설치가 불가능하므로, 모바일 환경에서는 프로모션을 표시하지 않음
  if (isMobile) {
    return null
  }
  return (
    <MainPromoteCard
      href={extensionStoreUrl || "#"}
      target="_blank"
      icon={<Puzzle color="#05df72" />}
      title="브라우저 확장 프로그램"
      description={
        <div>
          온라인 서점 페이지에서 내가 보고있는 책이 근처에 있는지 바로
          확인하세요
          <br />
          <span className="font-semibold text-green-400">
            Chrome / Whale
          </span>{" "}
          확장 프로그램으로 바로 검색!
        </div>
      }
    />
  )
}
