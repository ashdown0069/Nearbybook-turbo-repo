import { Button } from "@/components/ui/button";
import { CircleCheckBig, LibraryBig } from "lucide-react";

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
    <div className="flex h-full w-full flex-col items-center justify-evenly gap-3">
      <CircleCheckBig size={72} color="#07cf4a" />
      <div className="text-center text-2xl font-bold">{title}</div>
      <div className="flex w-3/4 items-center justify-center gap-3 rounded-xl bg-green-50 p-4">
        <LibraryBig size={24} color={"#07cf4a"} />
        <div className="text-sm font-extrabold text-green-600">
          {foundLibsLen}곳의 도서관을 찾았어요.
        </div>
      </div>
      <div className="w-3/4">
        <Button
          asChild
          className="w-full cursor-pointer bg-green-500 py-6 font-bold hover:bg-green-400"
        >
          <a href={ExternalSiteURL} target="_blank" rel="noopener noreferrer">
            소장 도서관 보기
          </a>
        </Button>
        <p className="mt-3 text-center text-xs text-gray-500">
          외부 지도 사이트로 연결 됩니다.
        </p>
      </div>
    </div>
  );
}
