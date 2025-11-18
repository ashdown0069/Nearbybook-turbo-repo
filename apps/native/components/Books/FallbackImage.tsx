import { Image } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

export default function FallbackImage() {
  return (
    <View className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-300">
      <Image />
      <Text>No image</Text>
    </View>
  );
}
