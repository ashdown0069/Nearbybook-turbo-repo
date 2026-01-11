import React from "react";
import { Text, View } from "react-native";

export default function SearchResultInfo({ result }: { result: number }) {
  return (
    <View className="flex h-14 items-center justify-center">
      <Text className="text-base">
        총 <Text className="text-green-500">{result}</Text>
        개의 책이 검색되었습니다.
      </Text>
    </View>
  );
}
