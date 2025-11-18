import React from "react";
import { Text, View } from "react-native";

export default function Header() {
  return (
    <View className="flex h-20 flex-col items-center justify-center">
      <Text className="text-2xl font-bold">공공도서관 책 찾기</Text>
      <Text className="text-slate-600">찾고 싶은 책을 검색 해보세요.</Text>
    </View>
  );
}
