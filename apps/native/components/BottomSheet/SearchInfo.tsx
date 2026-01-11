import React from "react";
import { View } from "react-native";
import TextWithIcon from "../TextWithIcon";
import { Dot, Info, ShieldCheck } from "lucide-react-native";

export default function SearchInfo() {
  return (
    <View className="mx-auto mt-6 p-3">
      <TextWithIcon
        iconComponent={<Info color={"#3b82f6"} />}
        text="지도 검색 안내"
        textClassName="text-base"
        containerClassName="mb-3"
      />
      <TextWithIcon
        iconComponent={<Dot />}
        text="검색은 지도 중앙을 기준으로 이루어집니다."
      />
      <TextWithIcon
        iconComponent={<Dot />}
        text="원하는 지역이 중앙에 오도록 지도를 이동해주세요."
      />
      <TextWithIcon iconComponent={<Dot />} text="대도시: '구' 단위로 검색" />
      <TextWithIcon
        iconComponent={<Dot />}
        text=" 그 외 지역: '시' 또는 '군' 단위로 검색"
      />
    </View>
  );
}
