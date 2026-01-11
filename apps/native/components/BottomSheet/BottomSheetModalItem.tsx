import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

//modal에서 사용
export default function BottomSheetModalItem({
  title,
  description,
  iconComponent,
  titleClassName,
  descriptionClassName,
  onPress,
}: {
  title: string;
  description: string;
  iconComponent: React.ReactElement;
  titleClassName?: string;
  descriptionClassName?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex max-h-20 flex-1 flex-row items-center justify-between gap-5 p-3 active:bg-slate-100"
    >
      <View className="flex-row items-center justify-center gap-4">
        <View className="items-center justify-center rounded-full bg-neutral-100 p-3">
          {iconComponent}
        </View>
        <View className="flex flex-col gap-1">
          <Text className={cn("text-xl", titleClassName)}>{title}</Text>
          <Text className={cn("text-neutral-500", descriptionClassName)}>
            {description}
          </Text>
        </View>
      </View>
      <View>
        <ChevronRight />
      </View>
    </Pressable>
  );
}
