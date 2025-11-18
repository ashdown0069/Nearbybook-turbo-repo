import { Text, View } from "react-native";
import SearchTipItem from "./SearchTipItem";

export default function SearchISBNTip() {
  return (
    <View role="list" className="p-3">
      <View className="py-3">
        <Text className="text-base font-semibold">💡 검색 팁</Text>
      </View>
      <SearchTipItem>ISBN이 달라도 도서 제목이 같을 수 있습니다.</SearchTipItem>
      <SearchTipItem>13자리 숫자를 입력해야 합니다.</SearchTipItem>
    </View>
  );
}
