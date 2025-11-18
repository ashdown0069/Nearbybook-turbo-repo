import { Pressable, Text } from "react-native";
import type { LucideIcon } from "lucide-react-native";
interface MainTileBtnProps {
  BtnText: string;
  Icon: React.ReactElement<LucideIcon>;
}

export default function MainTileBtn({
  BtnText,
  Icon,
  ...rest
}: MainTileBtnProps & React.ComponentPropsWithRef<typeof Pressable>) {
  return (
    <Pressable
      {...rest}
      className="min-h-36 w-2/5 flex-col items-center justify-center gap-3 rounded-lg bg-green-600 p-6"
    >
      {Icon}
      <Text className="text-center leading-4 text-white">{BtnText}</Text>
    </Pressable>
  );
}
