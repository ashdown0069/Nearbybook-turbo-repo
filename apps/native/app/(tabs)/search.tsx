import SearchInput from "@/components/Search/SearchInput";
import { axiosInstance } from "@/lib/axios";
import { useSearchBooksByTitle } from "@repo/data-access";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
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
import SearchTitleTip from "@/components/Search/SearchTitleTip";
import NoResult from "@/components/Search/NoResult";
export default function SearchScreen() {
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
  const { data, isLoading, fetchNextPage, isFetchingNextPage, isError } =
    useSearchBooksByTitle(axiosInstance, searchQuery);
  const BOOKS = useMemo(
    () => data?.pages.flatMap((page) => page.books) ?? [],
    [data?.pages],
  );
  //  .filter((book) => Number.isInteger(Number(book.publicationYear)))
  if (!searchQuery) {
    // 초기 로딩 상태 (검색어가 없을 때)
    return (
      <SafeAreaView className="flex-1">
        <SearchInput
          placeholder="제목으로 검색"
          query={searchQuery}
          setQuery={setSearchQuery}
        />
        <View className="mt-3 px-3">
          <SearchTitleTip />
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
        placeholder="제목으로 검색"
        query={searchQuery}
        setQuery={setSearchQuery}
      />
      {data && data.pages[0].numFound !== 0 && (
        <SearchResultInfo result={data.pages[0].numFound ?? 0} />
      )}
      <FlashList
        contentContainerClassName="px-3 flex-1"
        data={BOOKS}
        renderItem={({ item }) => (
          <BookItem book={item} handlePressBookItem={handlePressBookItem} />
        )}
        ListEmptyComponent={<NoResult />}
        keyExtractor={(item) => item.isbn}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        ListFooterComponent={() => {
          if (isFetchingNextPage) {
            return (
              <View className="flex h-8 items-center justify-center">
                <ActivityIndicator size="small" color="#00ff00" />
              </View>
            );
          }
        }}
      />
      <BookBottomSheetModal ref={bottomSheetModalRef}>
        <FindOnTheMap />
        <SaveBookOnTheShelf saveBookToBookshelf={saveBookToBookshelf} />
      </BookBottomSheetModal>
    </BottomSheetProvider>
  );
}
