import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectedLibrary() {
  const { libCode, name } = useLocalSearchParams();
  return (
    <View className="p-5">
      <Text>Selected Library</Text>
      <Text>Library Code: {libCode}</Text>
      <Text>Library Name: {name}</Text>
    </View>
  );
}
