import React from "react";
import type { Book } from "@repo/types";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

export default function PopularBook({
  bookname = "test name",
  authors = "test name",
  bookImageURL = "https://placehold.co/200x360/png",
  publicationYear = "2023",
  publisher = "test publisher",
  ...rest
}: Partial<Book> & React.ComponentPropsWithRef<typeof Pressable>) {
  return (
    <Pressable {...rest} className="h-72 w-2/5">
      <View className="h-5/6">
        <Image
          source={{
            uri: bookImageURL,
          }}
          contentFit="cover"
          style={{
            width: "100%",
            height: "100%",
          }}
          accessibilityLabel={bookname}
        />
      </View>
      <View className="mt-1 flex h-1/6 items-center px-1">
        <Text
          className="text-base font-semibold"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {bookname}
        </Text>
      </View>
    </Pressable>
  );
}
