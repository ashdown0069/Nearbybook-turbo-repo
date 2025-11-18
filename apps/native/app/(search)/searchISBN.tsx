import SearchInput from "@/components/Search/SearchInput";
import { axiosInstance } from "@/lib/axios";
import { useSearchBooksByISBN } from "@repo/data-access";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BookItem from "@/components/Books/BookItem";
import { useCurrentBookStore } from "@/hooks/useCurrentBook";
import SearchResultInfo from "@/components/Search/SearchResultInfo";
import BookBottomSheetModal from "@/components/BottomSheet/Modal";
import BottomSheetProvider from "@/components/Provider/BottomSheetProvider";
import { useDatabase } from "@/db/provider";
import Toast from "react-native-toast-message";
import { Book } from "@repo/types";
import { useRouter } from "expo-router";
import SaveBookOnTheShelf from "@/components/BottomSheet/SaveBookOnTheShelf";
import FindOnTheMap from "@/components/BottomSheet/FindOnTheMap";
import { saveBookToDataBase } from "@/db/service/Book";
import SearchISBNTip from "@/components/Search/SearchISBNTip";
import NoResult from "@/components/Search/NoResult";
export default function SearchISBNScreen() {
  //book select
  const selectBook = useCurrentBookStore((state) => state.selectBook);
  const selectedBook = useCurrentBookStore((state) => state.selectedBook);
  //bottom sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePressBookItem = useCallback((book: Book) => {
    bottomSheetModalRef.current?.present();
    selectBook(book);
  }, []);
  //get db
  const { db } = useDatabase();

  const router = useRouter();
  const saveBookToBookshelf = async () => {
    if (selectedBook && db) {
      await saveBookToDataBase(db, selectedBook, () => {
        bottomSheetModalRef.current?.dismiss();
        Toast.show({
          onPress: () => {
            router.push("/(tabs)/mybooks");
          },
          type: "custom",
          text1: "책이 성공적으로 저장되었습니다.",
          text2: "확인하기",
          position: "bottom",
        });
      });
    }
  };

  //search
  const [searchQuery, setSearchQuery] = useState("");
  const [queryError, setQueryError] = useState(false);

  const handleInputValidation = (query: string): boolean => {
    const regex = /^\d{13}$/;
    if (regex.test(query)) {
      setQueryError(false);
      return true;
    } else {
      setQueryError(true);
      return false;
    }
  };
  const { data, isLoading, isError } = useSearchBooksByISBN(
    axiosInstance,
    searchQuery,
  );
  //  .filter((book) => Number.isInteger(Number(book.publicationYear)))

  if (!searchQuery) {
    // 초기 로딩 상태 (검색어가 없을 때)
    return (
      <SafeAreaView className="flex-1">
        <SearchInput
          placeholder="ISBN으로 검색"
          query={searchQuery}
          setQuery={setSearchQuery}
          validation={handleInputValidation}
        />
        {queryError && (
          <Text className="my-2 text-center text-red-500">
            올바른 13자리 ISBN을 입력해주세요.
          </Text>
        )}
        <View className="mt-3 px-3">
          <SearchISBNTip />
        </View>
      </SafeAreaView>
    );
  }
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00ff00" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 flex-col items-center justify-center gap-2">
        <Text className="text-red-500">오류가 발생했습니다.</Text>
        <Text className="text-red-500">잠시 후에 다시 시도해주세요.</Text>
      </SafeAreaView>
    );
  }

  return (
    <BottomSheetProvider>
      <SearchInput
        placeholder="ISBN으로 검색"
        query={searchQuery}
        setQuery={setSearchQuery}
      />
      {data && data.books.length > 0 && (
        <SearchResultInfo result={data?.numFound ?? 0} />
      )}
      {data && data.books.length === 0 && <NoResult />}
      {data && data.books.length > 0 && (
        <View className="px-3">
          <BookItem
            book={data.books[0]}
            handlePressBookItem={handlePressBookItem}
          />
        </View>
      )}
      <BookBottomSheetModal ref={bottomSheetModalRef}>
        <FindOnTheMap />
        <SaveBookOnTheShelf saveBookToBookshelf={saveBookToBookshelf} />
      </BookBottomSheetModal>
    </BottomSheetProvider>
  );
}
