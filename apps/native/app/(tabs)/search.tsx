import {
  SearchInput,
  NoResult,
  SearchTitleTip,
  SearchResultInfo,
} from "@/features/Search";
import { axiosInstance } from "@/lib/axios";
import { useSearchBooksByTitle } from "@repo/data-access";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BookItem from "@/features/Book/components/BookItem";
import { useCurrentBookStore } from "@/store/useCurrentBook";
import BookBottomSheetModal from "@/components/BottomSheet/BookBottomSheetModal";
import { Book } from "@repo/types";
import SaveBookOnTheShelf from "@/features/Map/components/bottomsheet/SaveBookOnTheShelf";
import FindOnTheMap from "@/features/Map/components/bottomsheet/FindOnTheMap";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
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
  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  //search
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    refetch,
  } = useSearchBooksByTitle(axiosInstance, searchQuery);
  // const BOOKS = data?.allBooks ?? [];
  const BOOKS = useMemo(
    () => data?.pages.flatMap((page) => page.books) ?? [],
    [data],
  );

  const renderItem = useCallback(
    ({ item }: { item: Book }) => (
      <BookItem book={item} handlePressBookItem={handlePressBookItem} />
    ),
    [handlePressBookItem],
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
    return <Loading />;
  }

  if (isError) {
    return <Error message="search error" refetch={refetch} />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={{
        bottom: "off",
        top: "additive",
        right: "additive",
        left: "additive",
      }}
    >
      <SearchInput
        placeholder="제목으로 검색"
        query={searchQuery}
        setQuery={setSearchQuery}
      />
      {data && data.pages[0].numFound !== 0 && (
        <SearchResultInfo result={data.pages[0].numFound} />
      )}
      <FlashList
        contentContainerClassName="px-3"
        style={{
          flex: 1,
        }}
        data={BOOKS}
        renderItem={renderItem}
        ListEmptyComponent={
          <View className="h-40">
            <NoResult />
          </View>
        }
        keyExtractor={(item, index) => item.isbn + index.toString()}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
      />
      <BookBottomSheetModal ref={bottomSheetModalRef}>
        <FindOnTheMap href={"../(maps)/bookmap"} onPress={closeBottomSheet} />
        <SaveBookOnTheShelf onPress={closeBottomSheet} />
        {/* <SaveBookOnTheShelf saveBookToBookshelf={saveBookToBookshelf} /> */}
      </BookBottomSheetModal>
    </SafeAreaView>
  );
}
