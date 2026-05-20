import { Button } from "@workspace/ui/components/button"
import { Settings } from "lucide-react"

export default function NeedsSetup() {
  const handleOpenOptions = () => {
    browser.runtime.openOptionsPage()
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <Settings size={48} className="text-slate-400" />
      <div className="text-center">
        <h2 className="text-lg font-semibold text-slate-700">검색 설정 필요</h2>
        <p className="mt-2 text-sm text-slate-500">
          도서를 검색할 지역과 도서관을 설정해 주세요
        </p>
      </div>
      <Button
        onClick={handleOpenOptions}
        className="cursor-pointer bg-green-500 px-6 py-2 hover:bg-green-400"
      >
        설정하기
      </Button>
    </div>
  )
}
