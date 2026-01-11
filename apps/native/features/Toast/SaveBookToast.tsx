import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { toast } from "sonner-native";

export default function SaveBookToast() {
  const router = useRouter();
  return toast("책이 성공적으로 저장되었습니다.", {
    style: {
      backgroundColor: "#262626",
      paddingVertical: 20,
    },
    styles: {
      title: {
        color: "white",
      },
    },
    icon: <></>,
    close: (
      <Pressable
        className="text-sm"
        onPress={() => router.push("/(tabs)/mybooks")}
      >
        <Text className="text-green-400">확인하기</Text>
      </Pressable>
    ),
  });
}
