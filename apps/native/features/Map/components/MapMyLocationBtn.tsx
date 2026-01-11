import { LocateFixed } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

export default function MapMyLocationBtn({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute right-4 size-12 items-center justify-center rounded-full bg-white shadow-sm"
    >
      <LocateFixed size={32} color="#22c55e" />
    </Pressable>
  );
}
