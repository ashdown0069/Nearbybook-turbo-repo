import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import { useCurrentBookStore } from "@/store/useCurrentBook";
export default function BookDetailScreen() {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        // return;
      }
    })();
  });

  const { bookdetail } = useLocalSearchParams();
  const book = useCurrentBookStore((state) => state.selectedBook);
  return (
    <SafeAreaView>
      <Text>{bookdetail}</Text>
    </SafeAreaView>
  );
}
