import React from "react";
import { Text, View } from "react-native";
import { Book } from "@repo/types";
import { Bookmark, BookPlus } from "lucide-react-native";
import Button from "@/components/Button";
import { useBookDataBase } from "@/db/service/Book";
import { useCurrentBookStore } from "@/store/useCurrentBook";
import { useToast } from "@/features/Toast/useToast";
export default function BottomSheetBookInfo({
  bookname,
  authors,
  isbn,
}: Pick<Book, "bookname" | "authors" | "isbn">) {
  const selectedBook = useCurrentBookStore((state) => state.selectedBook);
  const { showSaveBookToast } = useToast();
  const { saveBook } = useBookDataBase();
  const handleSaveBookToShelf = async () => {
    if (selectedBook) {
      await saveBook(selectedBook, () => {
        showSaveBookToast();
      });
    }
  };
  return (
    <View className="flex flex-row gap-1">
      <View className="flex w-10/12 flex-1 flex-col items-start gap-1">
        <Text
          className="text-center text-base font-semibold"
          numberOfLines={2}
          lineBreakMode="tail"
        >
          {bookname}
        </Text>
        <Text
          className="text-neutral-600"
          numberOfLines={1}
          lineBreakMode="tail"
        >
          {authors}
        </Text>
      </View>
      <View className="w-2/12 items-center justify-center">
        <Button
          onPress={handleSaveBookToShelf}
          variant="ghost"
          className="rounded-full active:bg-gray-100"
        >
          <BookPlus />
        </Button>
      </View>
    </View>
  );
}
