import React from "react";
import { Pressable, Text } from "react-native";

export default function MapSearchAgainBtn({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute -bottom-10 left-1/2 w-36 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-2 shadow-md"
    >
      <Text className="text-center text-white">이 지역 검색하기</Text>
    </Pressable>
  );
}
