import { Alert, Linking } from "react-native";

export const openSettingsAlert = (onCancelPress?: () => void) => {
  Alert.alert(
    "위치 권한 필요",
    "원활한 서비스 이용을 위해 위치 권한이 필요합니다.\n설정 화면으로 이동하시겠습니까?",
    [
      {
        text: "취소",
        style: "cancel",
        onPress: onCancelPress,
      },
      {
        text: "이동",
        onPress: () => {
          Linking.openSettings();
        },
      },
    ],
  );
};
