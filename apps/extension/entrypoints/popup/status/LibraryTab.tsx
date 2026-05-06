import type { libraryResult } from "@/types/types";
import FoundAtLibrary from "./FoundAtLibrary";
import NotFoundAtLibrary from "./NotFoundAtLibrary";

export default function LibraryTab({
  data,
}: {
  data: libraryResult | null;
}) {
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        도서관 정보를 불러올 수 없습니다
      </div>
    );
  }

  if (!data.hasBook) {
    return (
      <div className="h-full">
        <NotFoundAtLibrary libName={data.libName} />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <FoundAtLibrary
        libName={data.libName}
        loanAvailable={data.loanAvailable}
        bookCode={data.bookCode}
        shelfLocation={data.shelfLocation}
      />
    </div>
  );
}
