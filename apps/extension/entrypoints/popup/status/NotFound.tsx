import { CircleX } from "lucide-react";

export default function NotFound({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-3">
      <CircleX size={72} color="#ff0000" className="mb-3" />
      <p className="max-w-56 text-center text-base font-bold">{title}</p>
      <p className="text-center text-sm leading-relaxed text-slate-600">
        설정 지역에 책을 소유한 도서관이 없습니다.
      </p>
    </div>
  );
}
