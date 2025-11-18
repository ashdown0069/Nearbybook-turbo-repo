import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Link } from "expo-router";
import { BookmarkPlus, ChevronRight, MapPinned } from "lucide-react-native";
import React, { useCallback, useRef } from "react";
import { Pressable, Text, View } from "react-native";

export default function BookBottomSheetModal({
  ref,
  children,
}: {
  ref: React.RefObject<BottomSheetModal | null>;
  children: React.ReactNode;
}) {
  // callbacks

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      // onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      containerStyle={{
        flex: 1,
      }}
    >
      <BottomSheetView className="flex-1">{children}</BottomSheetView>
    </BottomSheetModal>
  );
}
