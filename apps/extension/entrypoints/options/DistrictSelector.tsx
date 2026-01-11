import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROVINCES,
  SELECT_KOREAN_ADMINISTRATIVE_DISTRICTS_CODE_AND_NAME,
} from "@/const";
import { district, districtPreferenceStoreType } from "@/types/types";
import useAsync from "react-use/lib/useAsync";
import {
  getDistrictPreference,
  setDistrictPreference,
} from "@/utils/storage/district";
import { clearSessionTabState } from "@/utils/storage/session";
export default function DistrictSelector() {
  const state = useAsync(getDistrictPreference);
  const [isSaved, setIsSaved] = useState(false);
  const [districtData, setDistrictData] = useState<districtPreferenceStoreType>(
    {
      SiDo: { name: "", code: "" },
      SiGunGu: { name: "", code: "" },
      AdjacencySiGunGuList: [],
    },
  );

  useEffect(() => {
    if (state.value) {
      setDistrictData(state.value);
    }
  }, [state.value]);

  const siGunGuList = districtData.SiDo.name
    ? SELECT_KOREAN_ADMINISTRATIVE_DISTRICTS_CODE_AND_NAME[
        districtData.SiDo
          .name as keyof typeof SELECT_KOREAN_ADMINISTRATIVE_DISTRICTS_CODE_AND_NAME
      ]
    : [];

  const handleSiDoChange = (siDoCode: string) => {
    setIsSaved(() => false);
    const foundSiDo = PROVINCES.find((item) => item.code === siDoCode);
    if (!foundSiDo) return;
    setDistrictData((prev) => ({
      ...prev,
      SiDo: foundSiDo,
      SiGunGu: { name: "", code: "" }, // Reset SiGunGu when SiDo changes
    }));
  };

  const handleSiGuGunChange = (siGunGuCode: string) => {
    setIsSaved(() => false);
    const foundSiGunGu = siGunGuList.find((item) => item.code === siGunGuCode);
    if (!foundSiGunGu) return;

    setDistrictData((prev) => ({
      ...prev,
      SiGunGu: {
        code: foundSiGunGu.code,
        name: foundSiGunGu.name,
      },
      AdjacencySiGunGuList: foundSiGunGu.adjacency || [],
    }));
  };

  const handleSettingSave = async () => {
    setIsSaved(() => false);
    if (!districtData.SiDo || !districtData.SiGunGu.code) return;
    await setDistrictPreference(
      districtData.SiDo,
      districtData.SiGunGu,
      districtData.AdjacencySiGunGuList,
    );
    await clearSessionTabState();

    setIsSaved(() => true);
  };

  if (state.loading) {
    return null;
  }

  return (
    <div className="w-full rounded-md bg-white p-10">
      <div className="mb-10 p-3 text-center text-xl">
        도서를 검색할 지역을 선택해 주세요
      </div>
      <div className="flex justify-center gap-3">
        <Select onValueChange={handleSiDoChange} value={districtData.SiDo.code}>
          <SelectTrigger className="w-full shadow-none">
            <SelectValue placeholder="시/도 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>시/도</SelectLabel>
              {PROVINCES.map((siDo) => (
                <SelectItem key={siDo.code} value={siDo.code}>
                  {siDo.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={handleSiGuGunChange}
          value={districtData.SiGunGu.code}
          disabled={!districtData.SiDo.code}
        >
          <SelectTrigger className="w-full focus:outline-none">
            <SelectValue placeholder="시/군/구 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>시/군/구</SelectLabel>
              {siGunGuList.map((siGunGu: district) => (
                <SelectItem key={siGunGu.code} value={siGunGu.code}>
                  {siGunGu.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        {isSaved && (
          <div className="flex items-center justify-center px-2 text-base text-green-600">
            저장 완료 ✓
          </div>
        )}
        <Button
          onClick={handleSettingSave}
          variant={"default"}
          className="cursor-pointer bg-green-500 px-4 py-2 hover:bg-green-400"
        >
          저장하기
        </Button>
      </div>
    </div>
  );
}
