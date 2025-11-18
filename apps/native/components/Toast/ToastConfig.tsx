import { Pressable, View, Text } from "react-native";
import { BaseToast, ToastConfigParams } from "react-native-toast-message";

export const toastConfig = {
  custom: ({ text1, onPress, ...props }: ToastConfigParams<any>) => (
    <View
      {...props}
      className="h-16 w-[80%] flex-row items-center justify-around rounded-md bg-neutral-800 px-3"
      //   contentContainerStyle={{
      //     flexDirection: "row",
      //     alignItems: "center",
      //     justifyContent: "space-between",
      //     gap: 0,
      //   }}
      //   text1Style={{
      //     fontSize: 14,
      //     fontWeight: "500",
      //     color: "white",
      //     width: "70%",
      //   }}
      //   text2Style={{
      //     width: "30%",
      //     fontSize: 12,
      //     color: "#86efac",
      //     fontWeight: "500",
      //     textAlign: "right",
      //     alignContent: "flex-end",
      //   }}
    >
      <View>
        <Text className="font-semibold text-white">{text1}</Text>
      </View>
      <Pressable onPress={onPress}>
        <Text className="text-green-300">확인하기</Text>
      </Pressable>
    </View>
  ),
};
