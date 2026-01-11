import { XCircle } from "lucide-react";

export default function NotFound({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center justify-center gap-3">
        <XCircle size={72} className="text-destructive" />
        <h2 className="text-lg font-semibold text-slate-700">검색 결과 없음</h2>
      </div>
      <div className="text-center text-base">
        <span className="font-bold text-red-500">{title}</span> <br />
        을(를) 소유한 도서관을
        <br /> 선택하신 지역에서 찾지 못했습니다.
      </div>
    </div>
  );
}
