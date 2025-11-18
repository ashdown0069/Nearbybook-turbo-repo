import { BookmarkPlus, ChevronRight } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function SaveBookOnTheShelf({
  saveBookToBookshelf,
}: {
  saveBookToBookshelf: () => void;
}) {
  return (
    <Pressable
      onPress={saveBookToBookshelf}
      className="flex flex-1 flex-row items-center justify-between gap-5 px-5 py-3"
    >
      <View className="flex-row items-center justify-center gap-4">
        <View className="items-center justify-center rounded-full bg-neutral-100 p-3">
          <BookmarkPlus />
        </View>
        <View className="flex flex-col gap-1">
          <Text className="text-xl">책 저장하기</Text>
          <Text className="text-neutral-500">
            나의 서재에 이 책을 추가합니다.
          </Text>
        </View>
      </View>
      <View>
        <ChevronRight />
      </View>
    </Pressable>
  );
}
