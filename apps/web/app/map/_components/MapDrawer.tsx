"use client"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import type { Library } from "@workspace/types"
import { Bed, BriefcaseBusiness, House, Phone } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import BookLoanInfo from "./BookLoanInfo"

export default function MapDrawer({
  libName,
  address,
  homepage,
  closed,
  operatingTime,
  tel,
  hasBook,
  isOpen,
  libCode,
  isbn,
  setIsOpen,
}: Omit<Library, "latitude" | "longitude"> & {
  isbn?: string
  isOpen: boolean
  setIsOpen: (open: boolean) => void // 부모의 useState setter가 그대로 들어올 수 있도록 타입을 맞춰줍니다.
}) {
  useEffect(() => {
    setIsOpen(true)
  }, [setIsOpen])
  useEffect(() => {
    // 1. 드로어가 닫혀 있을 때는 아무 작업도 하지 않습니다.
    if (!isOpen) return

    const stateName = "map-drawer-open"

    // 2. 가상 히스토리 쌓기
    // 중복으로 히스토리가 쌓이는 것을 방지하기 위해, 현재 상태가 아닐 때만 pushState를 실행합니다.
    if (window.history.state?.state !== stateName) {
      window.history.pushState({ state: stateName }, "")
    }

    // 3. 사용자가 모바일 뒤로가기를 눌렀을 때의 처리
    const handlePopState = () => {
      // 브라우저가 이미 한 칸 뒤로 이동했으므로, 리액트 상태만 닫힘(false)으로 변경합니다.
      setIsOpen(false)
    }

    // popstate 이벤트를 등록하여 브라우저의 뒤로가기 신호를 감시합니다.
    window.addEventListener("popstate", handlePopState)

    // 4. 클린업 함수 (드로어가 어떤 이유로든 화면에서 사라지거나 닫힐 때 실행)
    return () => {
      window.removeEventListener("popstate", handlePopState)

      // [가장 중요] 사용자가 뒤로가기가 아니라 'X 버튼', '배경(Backdrop) 터치', '아래로 스와이프'로 직접 닫은 경우
      // 히스토리 스택에 여전히 'map-drawer-open' 찌꺼기가 남아있게 됩니다.
      // 이 상태를 그대로 두면 다음번 뒤로가기를 누를 때 헛발질을 하므로, 강제로 히스토리를 한 칸 지워줍니다.
      if (window.history.state?.state === stateName) {
        window.history.back()
      }
    }
  }, [isOpen, setIsOpen])

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger />
      <DrawerClose />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{libName}</DrawerTitle>
          <DrawerDescription>{address}</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-2 p-3 text-sm">
          <Link
            href={homepage}
            className="flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <House size={16} strokeWidth={1.5} />
            <p className="truncate">{homepage}</p>
          </Link>

          <div className="flex items-center gap-1">
            <Phone size={16} strokeWidth={1.5} />
            <p className="truncate"> {tel}</p>
          </div>

          <div className="flex items-center gap-1">
            <BriefcaseBusiness size={16} strokeWidth={1.5} />
            <p className="truncate">{operatingTime}</p>
          </div>

          <div className="flex items-center gap-1">
            <Bed size={16} strokeWidth={1.5} />
            <p className="truncate">{closed}</p>
          </div>
        </div>

        <DrawerFooter className="pb-8">
          {hasBook && isbn && <BookLoanInfo isbn={isbn} libCode={libCode} />}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
