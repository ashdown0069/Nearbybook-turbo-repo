import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react-native";
import { Text, View } from "react-native";
interface SearchTipItemProps {
  children: React.ReactNode;
  iconClassName?: string;
  textClassName?: string;
}
export default function SearchTipItem({
  children,
  iconClassName,
  textClassName,
}: SearchTipItemProps) {
  return (
    <View role="listitem" className="mb-2 flex-row">
      <View className={cn("justify-center pr-1", iconClassName)}>
        <CircleCheck size={16} color="#49da4b" />
      </View>
      <View className="flex-1">
        <Text className={cn("text-sm", textClassName)}>{children}</Text>
      </View>
    </View>
  );
}
