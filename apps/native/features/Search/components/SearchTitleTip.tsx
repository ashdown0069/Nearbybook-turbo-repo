import { Text, View } from "react-native";
import SearchTipItem from "./SearchTipItem";

export default function SearchTitleTip() {
  return (
    <View role="list" className="p-3">
      <View className="py-3">
        <Text className="text-base font-semibold">💡 검색 팁</Text>
      </View>
      <SearchTipItem>
        제목으로 검색할 경우 도서 제목을 <Text className="font-bold">모두</Text>{" "}
        입력하세요
      </SearchTipItem>
      <SearchTipItem>
        동일한 제목의 도서가 여러 개 존재할 수 있습니다.
      </SearchTipItem>
      <SearchTipItem iconClassName="justify-start pt-0.5">
        <Text className="font-bold">ISBN(13자리)</Text>으로 검색하면 가장 정확한
        결과를 얻을 수 있습니다.
      </SearchTipItem>
    </View>
  );
}
