import BookInfo from "./BookInfo";
import Notification from "./Notification";
import Search from "@/app/search/_components/Search";
import Feedback from "@/components/common/Feedback";
import ExtensionPromotion from "@/components/common/ExtensionPromotion";
import Logo from "@/components/common/Logo";
import type { Book } from "@repo/types";

interface MapSidebarProps {
  book: Book | null;
}

export default function MapSidebar({ book }: MapSidebarProps) {
  return (
    <div className="hidden w-1/3 flex-col justify-between overflow-y-scroll border-r-2 bg-white md:flex">
      <div>
        <div className="flex items-center justify-center gap-2 pt-5">
          <Logo width={50} height={25} />
        </div>
        <div className="flex justify-center px-5">
          <Search />
        </div>
        <div className="w-full px-5">
          {book ? (
            <BookInfo book={book} />
          ) : (
            <div className="mb-2 rounded-md border p-3 text-center">
              <div className="text-red-500">
                도서 정보를 불러오는 중 오류가 발생했습니다.
              </div>
            </div>
          )}
        </div>
        <div className="w-full border-t border-gray-200 bg-gray-50 p-5">
          <Notification />
        </div>
        <ExtensionPromotion className="rounded-none bg-green-50 hover:bg-green-100" />
      </div>
      <Feedback />
    </div>
  );
}
