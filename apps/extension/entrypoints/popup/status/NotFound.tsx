import { CircleX } from "lucide-react"

export default function NotFound({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <CircleX size={72} color="#ff0000" className="mb-3" />
      <div className="space-y-2 text-center">
        <p className="max-w-[240px] text-[15px] font-semibold text-slate-800">
          {title}
        </p>
        <p className="text-sm leading-relaxed text-slate-500">
          설정 지역에 책을
          <br /> 소유한 도서관이 없습니다.
        </p>
      </div>
    </div>
  )
}
