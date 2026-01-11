import { AlertTriangle } from "lucide-react";

export default function NotAvailable() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 text-center">
      <div className="flex flex-col items-center justify-center">
        <AlertTriangle size={72} className="mb-4 text-yellow-500" />
        <h2 className="text-lg font-semibold text-slate-700">
          지원하지 않는 페이지
        </h2>
      </div>
      <p className="text-muted-foreground mt-2 text-base">
        <span className="text-green-500">
          네이버 도서 가격비교, 교보문고, <br />
          YES24, 알라딘
        </span>
        의 <br />
        <span className="font-bold text-yellow-500">
          도서 상세 페이지에서만
        </span>{" "}
        작동합니다.
        <br /> (E-book은 지원하지 않습니다.)
      </p>
    </div>
  );
}
