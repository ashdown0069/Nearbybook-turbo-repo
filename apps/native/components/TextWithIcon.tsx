import { cn } from "@/lib/utils";
import React from "react";
import { Text, View } from "react-native";

export default function TextWithIcon({
  iconComponent,
  containerClassName,
  textClassName,
  text,
}: {
  iconComponent: React.ReactElement;
  containerClassName?: string;
  text: string;
  textClassName?: string;
}) {
  return (
    <View
      className={cn("flex flex-row items-center gap-2", containerClassName)}
    >
      {iconComponent}
      <Text
        className={cn("", textClassName)}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {text}
      </Text>
    </View>
  );
}
