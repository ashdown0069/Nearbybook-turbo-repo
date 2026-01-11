import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BookBottomSheetModal({
  ref,
  children,
  ...props
}: {
  ref: React.RefObject<BottomSheetModal | null>;
  children: React.ReactNode;
} & BottomSheetModalProps) {
  const insets = useSafeAreaInsets();
  const [sheetIndex, setSheetIndex] = useState<number>(0); // 0 Open, -1 Close

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

  useFocusEffect(
    useCallback(() => {
      if (!ref) {
        return;
      }
      const backButtonAction = () => {
        if (sheetIndex === 0) {
          ref.current?.close();
          return true;
        }
        return false;
      };

      const backButtonHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backButtonAction,
      );

      return () => backButtonHandler.remove();
    }, [sheetIndex, ref]),
  );

  return (
    <BottomSheetModal
      ref={ref}
      bottomInset={insets.bottom}
      backdropComponent={renderBackdrop}
      containerStyle={{
        flex: 1,
      }}
      onChange={(idx, pos, type) => {
        if (props.onChange) props.onChange(idx, pos, type);
        setSheetIndex(idx);
      }}
      {...props}
    >
      <BottomSheetView className="flex-1">{children}</BottomSheetView>
    </BottomSheetModal>
  );
}
