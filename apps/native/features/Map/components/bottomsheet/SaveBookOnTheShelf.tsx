import BottomSheetModalItem from "@/components/BottomSheet/BottomSheetModalItem";
import { useBookDataBase } from "@/db/service/Book";
import { useToast } from "@/features/Toast/useToast";
import { useCurrentBookStore } from "@/store/useCurrentBook";
import { BookmarkPlus } from "lucide-react-native";
import React from "react";

/**
 * @requires useCurrentBookStore,selectedBook
 */
export default function SaveBookOnTheShelf({
  onPress,
}: {
  onPress: () => void;
}) {
  const { showSaveBookToast } = useToast();
  const { saveBook } = useBookDataBase();
  const selectedBook = useCurrentBookStore((state) => state.selectedBook);
  const saveBookToBookshelf = async () => {
    if (selectedBook) {
      await saveBook(selectedBook, () => {
        onPress();
        showSaveBookToast();
      });
    }
  };
  return (
    <BottomSheetModalItem
      iconComponent={<BookmarkPlus />}
      title="책 저장하기"
      description="나의 서재에 이 책을 추가합니다."
      onPress={saveBookToBookshelf}
    />
  );
}
