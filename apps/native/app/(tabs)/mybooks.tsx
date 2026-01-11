import BookItem from "@/features/Book/components/BookItem";
import FindOnTheMap from "@/features/Map/components/bottomsheet/FindOnTheMap";
import BookBottomSheetModal from "@/components/BottomSheet/BookBottomSheetModal";
import { useCurrentBookStore } from "@/store/useCurrentBook";
import { type BottomSheetModal } from "@gorhom/bottom-sheet";
import type { Book } from "@repo/types";
import React, { useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookDataBase } from "@/db/service/Book";
import Error from "@/components/Error";
import DeleteBookFromShelf from "@/features/Map/components/bottomsheet/DeleteBookFromShelf";
import Empty from "@/components/Empty";
import { BookIcon } from "lucide-react-native";

export default function MyBooksScreen() {
  const selectBook = useCurrentBookStore((state) => state.selectBook);
  const myBookBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePressBookItem = (book: Book) => {
    myBookBottomSheetModalRef.current?.present();
    selectBook(book);
  };

  const closeBottomSheet = () => {
    myBookBottomSheetModalRef.current?.dismiss();
  };

  const { savedBooks, isError } = useBookDataBase();

  if (savedBooks.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        edges={{
          bottom: "off",
          top: "additive",
          right: "additive",
          left: "additive",
        }}
      >
        <Empty
          Icon={<BookIcon size={46} color="#94A3B8" strokeWidth={1.5} />}
          title="책장이 비어있어요"
          description="아직 저장한 책이 없습니다.
읽고 싶은 책을 검색하여 채워보세요."
          buttonText="책 검색하기"
          onPress={() => {}}
        />
      </SafeAreaView>
    );
  }

  if (isError) {
    return <Error message="db error" />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={{
        bottom: "off",
        top: "additive",
        right: "additive",
        left: "additive",
      }}
    >
      <View className="mb-3 h-20 items-center justify-center bg-white py-1">
        <Text className="text-xl font-semibold">나의 서재</Text>
        <Text className="text-base">
          총 <Text className="text-green-500">{savedBooks.length}</Text>권이
          있습니다.
        </Text>
      </View>
      <ScrollView className="flex-1 px-3">
        {savedBooks &&
          savedBooks.map((book) => (
            <BookItem
              key={book.isbn}
              book={book}
              handlePressBookItem={handlePressBookItem}
            />
          ))}
      </ScrollView>
      <BookBottomSheetModal ref={myBookBottomSheetModalRef}>
        <FindOnTheMap href={"../(maps)/bookmap"} onPress={closeBottomSheet} />
        <DeleteBookFromShelf onPress={closeBottomSheet} />
      </BookBottomSheetModal>
    </SafeAreaView>
  );
}
