import {
  SearchInput,
  NoResult,
  SearchISBNTip,
  SearchResultInfo,
} from "@/features/Search";
import { axiosInstance } from "@/lib/axios";
import { useSearchBook } from "@repo/data-access";
import React, { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BookItem from "@/features/Book/components/BookItem";
import { useCurrentBookStore } from "@/store/useCurrentBook";
import BookBottomSheetModal from "@/components/BottomSheet/BookBottomSheetModal";
import { Book } from "@repo/types";
import FindOnTheMap from "@/features/Map/components/bottomsheet/FindOnTheMap";

import SaveBookOnTheShelf from "@/features/Map/components/bottomsheet/SaveBookOnTheShelf";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
export default function SearchISBNScreen() {
  //book select
  const selectBook = useCurrentBookStore((state) => state.selectBook);
  //bottom sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePressBookItem = useCallback((book: Book) => {
    bottomSheetModalRef.current?.present();
    selectBook(book);
  }, []);
  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
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
  const { data, isLoading, isError } = useSearchBook(
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
    return <Loading />;
  }

  if (isError) {
    return <Error message="isbn search error" />;
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
      <SearchInput
        placeholder="ISBN으로 검색"
        query={searchQuery}
        setQuery={setSearchQuery}
      />
      {data && Object.keys(data).length === 0 && (
        <View className="h-40">
          <NoResult />
        </View>
      )}
      {data && Object.keys(data).length > 0 && (
        <>
          <SearchResultInfo result={1} />
          <View className="px-3">
            <BookItem book={data} handlePressBookItem={handlePressBookItem} />
          </View>
        </>
      )}
      <BookBottomSheetModal ref={bottomSheetModalRef}>
        <FindOnTheMap href={"../(maps)/bookmap"} onPress={closeBottomSheet} />
        <SaveBookOnTheShelf onPress={closeBottomSheet} />
      </BookBottomSheetModal>
    </SafeAreaView>
  );
}
