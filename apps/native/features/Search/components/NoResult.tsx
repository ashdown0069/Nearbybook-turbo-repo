import React from "react";
import { Text, View } from "react-native";

export default function NoResult() {
  return (
    <View className="flex h-full flex-1 items-center justify-center">
      <Text className="text-base text-black">검색 결과가 없습니다.</Text>
    </View>
  );
}
