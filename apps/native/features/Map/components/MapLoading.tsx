import React from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapLoading() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white/80">
      <ActivityIndicator size="large" color="#00ff00" />
      <Text className="mt-3 text-center text-base">지도를 불러오는 중...</Text>
    </SafeAreaView>
  );
}
