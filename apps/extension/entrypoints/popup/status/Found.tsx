import { Button } from "@repo/ui/components/button";
import { CheckCircle2 } from "lucide-react";

export default function Found({
  title,
  foundLibsLen,
  region,
  detailRegion,
  isbn,
}: {
  title: string;
  foundLibsLen: number;
  region: string;
  detailRegion: string;
  isbn: string;
}) {
  const ExternalSiteURL = `${import.meta.env.WXT_EXTERNAL_URL}/map?isbn=${isbn}&region=${region}&dtl_region=${detailRegion}`;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2 pb-4 text-green-600">
          <CheckCircle2 size={20} />
          <span className="text-base font-semibold">
            {foundLibsLen}곳에서 찾았어요
          </span>
        </div>
        <p className="max-w-56 text-center text-base font-bold">{title}</p>
      </div>
      <div className="w-full max-w-56 space-y-2">
        <Button
          asChild
          className="w-full cursor-pointer bg-green-500 hover:bg-green-400"
        >
          <a href={ExternalSiteURL} target="_blank" rel="noopener noreferrer">
            소장 도서관 보기
          </a>
        </Button>
        <p className="text-center text-xs text-slate-400">
          외부 지도 사이트로 이동
        </p>
      </div>
    </div>
  );
}
