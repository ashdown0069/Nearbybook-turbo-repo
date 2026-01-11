import BookBottomSheetModal from "@/components/BottomSheet/BookBottomSheetModal";
import { type BottomSheetModal } from "@gorhom/bottom-sheet";

import React, { useMemo, useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Error from "@/components/Error";
import { useLibraryDataBase } from "@/db/service/Library";
import Empty from "@/components/Empty";
import { Book, LibraryIcon } from "lucide-react-native";

export default function MyLibsScreen() {
  const myBookBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePressBookItem = () => {
    myBookBottomSheetModalRef.current?.present();
  };

  const closeBottomSheet = () => {
    myBookBottomSheetModalRef.current?.dismiss();
  };

  const { savedLibraries, isError } = useLibraryDataBase();
  const Library = useMemo(() => {
    const foundLibrary = savedLibraries.find((lib) => lib.isActive);
    return foundLibrary;
  }, [savedLibraries]);

  if (!Library) {
    return (
      <Empty
        Icon={<LibraryIcon size={46} color="#94A3B8" strokeWidth={1.5} />}
        title="저정한 도서관이 없어요"
        description="자주 가는 도서관을 등록하면
         해당 도서관의 도서만 검색할 수 있어요"
        buttonText="내 주변 도서관 찾기"
        onPress={() => {}}
      />
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
      <ScrollView className="flex-1 p-3">
        <View>
          <Text>{Library?.libName}</Text>
        </View>
      </ScrollView>
      <BookBottomSheetModal ref={myBookBottomSheetModalRef}>
        <View></View>
      </BookBottomSheetModal>
    </SafeAreaView>
  );
}
