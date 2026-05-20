import { CircleX } from "lucide-react"

export default function NotFoundAtLibrary({ libName }: { libName: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <CircleX size={72} color="#ff0000" className="mb-3" />
      <p className="text-center text-base font-medium text-slate-600">
        <span className="font-semibold">{libName}</span>은 <br />
        해당 도서를 소유하고 있지 않아요.
      </p>
    </div>
  )
}
