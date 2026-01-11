import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";

export default function Error({
  message,
  refetch,
}: {
  message: string;
  refetch?: () => void;
}) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-center text-xl">오류가 발생했습니다.</Text>
      <Text className="text-center text-xl">잠시 후 다시 시도해주세요.</Text>
      <Text className="text-center text-xl">
        dev 에서만 보여야함 / {message}
      </Text>
      {refetch && (
        <Button onPress={refetch} className="mt-3">
          다시 시도하기
        </Button>
      )}
    </SafeAreaView>
  );
}
