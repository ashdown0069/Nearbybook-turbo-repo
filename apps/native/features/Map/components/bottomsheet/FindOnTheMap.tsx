import BottomSheetModalItem from "@/components/BottomSheet/BottomSheetModalItem";
import { Href, useRouter } from "expo-router";
import { MapPinned } from "lucide-react-native";

export default function FindOnTheMap({
  href,
  onPress,
}: {
  href: Href;
  onPress: () => void;
}) {
  const router = useRouter();

  const handleMoveToMap = () => {
    router.push(href);
    onPress();
  };

  return (
    <BottomSheetModalItem
      iconComponent={<MapPinned />}
      title="지도에서 찾기"
      description="주변의 공공도서관에서 책을 찾습니다."
      onPress={handleMoveToMap}
    />
  );
}
