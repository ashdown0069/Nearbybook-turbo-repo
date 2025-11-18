import BookItem from "@/components/Books/BookItem";
import FindOnTheMap from "@/components/BottomSheet/FindOnTheMap";
import BookBottomSheetModal from "@/components/BottomSheet/Modal";
import BottomSheetProvider from "@/components/Provider/BottomSheetProvider";
import { useDatabase } from "@/db/provider";
import { BooksTable } from "@/db/schema";
import { useCurrentBookStore } from "@/hooks/useCurrentBook";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { Book } from "@repo/types";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { useCallback, useRef } from "react";
import { ScrollView, Text, View } from "react-native";

export default function MyBooksScreen() {
  const selectBook = useCurrentBookStore((state) => state.selectBook);

  const myBookBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePressBookItem = useCallback((book: Book) => {
    myBookBottomSheetModalRef.current?.present();
    selectBook(book);
  }, []);
  const { db } = useDatabase();
  const { data } = useLiveQuery(db!.select().from(BooksTable));
  return (
    <BottomSheetProvider>
      <View className="mb-3 h-20 items-center justify-center bg-white py-1">
        <Text className="text-xl font-semibold">나의 서재</Text>
        <Text className="text-base">
          총 <Text className="text-green-500">{data.length}</Text>권이 있습니다.
        </Text>
      </View>
      <ScrollView className="flex-1 px-3">
        {data &&
          data.map((book) => (
            <BookItem
              key={book.isbn}
              book={book}
              handlePressBookItem={handlePressBookItem}
            />
          ))}
      </ScrollView>
      <BookBottomSheetModal ref={myBookBottomSheetModalRef}>
        <FindOnTheMap />
      </BookBottomSheetModal>
    </BottomSheetProvider>
  );
}
