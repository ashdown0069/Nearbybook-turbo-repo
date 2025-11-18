import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BottomSheetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={{
        bottom: "off",
        top: "additive",
        right: "additive",
        left: "additive",
      }}
    >
      <GestureHandlerRootView style={{ flex: 1, padding: 0 }}>
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
