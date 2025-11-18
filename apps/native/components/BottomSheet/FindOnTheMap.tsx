import { Link } from "expo-router";
import { ChevronRight, MapPinned } from "lucide-react-native";
import React, { Fragment } from "react";
import { Pressable, Text, View } from "react-native";

//flex-1 이 자식 modal의 자식클래스에 무조건 존재해야함
export default function FindOnTheMap() {
  return (
    <Fragment>
      <Link
        href={{
          pathname: "/(maps)/bookmap",
        }}
        asChild
      >
        <Pressable className="flex flex-1 flex-row items-center justify-between gap-5 px-5 py-3">
          <View className="flex-row items-center justify-center gap-4">
            <View className="items-center justify-center rounded-full bg-neutral-100 p-3">
              <MapPinned />
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-xl">지도에서 찾기</Text>
              <Text className="text-neutral-500">
                주변의 공공도서관에서 책을 찾습니다.
              </Text>
            </View>
          </View>
          <View>
            <ChevronRight />
          </View>
        </Pressable>
      </Link>
    </Fragment>
  );
}
