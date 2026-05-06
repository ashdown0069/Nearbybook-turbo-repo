import { Button } from "@repo/ui/components/button";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { Label } from "@repo/ui/components/label";
import {
  PROVINCES,
  SELECT_KOREAN_ADMINISTRATIVE_DISTRICTS_CODE_AND_NAME,
} from "@/const";
import type { district, searchSettingStoreType } from "@/types/types";
import type { Library } from "@repo/types";
import useAsync from "react-use/lib/useAsync";
import {
  getSearchSetting,
  setSearchSetting,
} from "@/utils/storage/searchSetting";
import { clearSessionTabState } from "@/utils/storage/session";
import { getLibsList } from "@repo/data-access";
import { axiosInstance } from "@/lib/axios";

export default function SearchSettings() {
  const state = useAsync(getSearchSetting);
  const [isSaved, setIsSaved] = useState(false);
  const [siDo, setSiDo] = useState<district>({ name: "", code: "" });
  const [siGunGu, setSiGunGu] = useState<district>({ name: "", code: "" });
  const [libCode, setLibCode] = useState("");
  const [defaultTab, setDefaultTab] = useState<"region" | "library">("region");
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [libsLoading, setLibsLoading] = useState(false);

  useEffect(() => {
    if (state.value) {
      setSiDo(state.value.SiDo);
      setSiGunGu(state.value.SiGunGu);
      setLibCode(state.value.library.libCode);
      setDefaultTab(state.value.defaultTab);
      // 저장된 설정의 도서관 목록 로드
      getLibsList(
        axiosInstance,
        state.value.SiDo.code,
        state.value.SiGunGu.code,
      )
        .then(setLibraries)
        .catch(() => {
          setLibraries([]);
        });
    }
  }, [state.value]);

  const siGunGuList = siDo.name
    ? SELECT_KOREAN_ADMINISTRATIVE_DISTRICTS_CODE_AND_NAME[
        siDo.name as keyof typeof SELECT_KOREAN_ADMINISTRATIVE_DISTRICTS_CODE_AND_NAME
      ]
    : [];

  const handleSiDoChange = (siDoCode: string) => {
    setIsSaved(false);
    const foundSiDo = PROVINCES.find((item) => item.code === siDoCode);
    if (!foundSiDo) return;
    setSiDo(foundSiDo);
    setSiGunGu({ name: "", code: "" });
    setLibCode("");
    setLibraries([]);
  };

  const handleSiGunGuChange = async (siGunGuCode: string) => {
    setIsSaved(false);
    const foundSiGunGu = siGunGuList.find(
      (item: district) => item.code === siGunGuCode,
    );
    if (!foundSiGunGu) return;
    setSiGunGu({ code: foundSiGunGu.code, name: foundSiGunGu.name });
    setLibCode("");

    setLibsLoading(true);
    try {
      const libs = await getLibsList(
        axiosInstance,
        siDo.code,
        foundSiGunGu.code,
      );
      setLibraries(libs);
    } catch {
      setLibraries([]);
    } finally {
      setLibsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!siDo.code || !siGunGu.code || !libCode || !defaultTab) return;
    const lib = libraries.find((l) => l.libCode === libCode);
    if (!lib) return;
    await setSearchSetting({
      SiDo: siDo,
      SiGunGu: siGunGu,
      library: { libCode: lib.libCode, libName: lib.libName },
      defaultTab,
    });
    await clearSessionTabState();
    setIsSaved(true);
  };

  const handleFindLibraryLink = () => {
    const url = `${import.meta.env.WXT_EXTERNAL_URL}/map/libs`;
    browser.tabs.create({ url });
  };

  if (state.loading) {
    return null;
  }

  const canSave = siDo.code && siGunGu.code && libCode && defaultTab;

  return (
    <div className="w-full rounded-md bg-white p-10">
      <div className="mb-6 p-3 text-center text-xl">
        도서를 검색할 지역과 도서관을 선택해 주세요
      </div>

      {/* 시/도 + 구/군 선택 */}
      <div className="flex justify-center gap-3">
        <Select onValueChange={handleSiDoChange} value={siDo.code}>
          <SelectTrigger className="w-full shadow-none">
            <SelectValue placeholder="시/도 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>시/도</SelectLabel>
              {PROVINCES.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={handleSiGunGuChange}
          value={siGunGu.code}
          disabled={!siDo.code}
        >
          <SelectTrigger className="w-full focus:outline-none">
            <SelectValue placeholder="시/군/구 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>시/군/구</SelectLabel>
              {siGunGuList.map((item: district) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 도서관 선택 */}
      <div className="mt-4 flex items-center gap-3">
        <Select
          onValueChange={(v) => {
            setLibCode(v);
            setIsSaved(false);
          }}
          value={libCode}
          disabled={!siGunGu.code || libsLoading}
        >
          <SelectTrigger className="w-full shadow-none">
            <SelectValue
              placeholder={libsLoading ? "도서관 로딩 중..." : "도서관 선택"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>도서관</SelectLabel>
              {libraries.map((lib) => (
                <SelectItem key={lib.libCode} value={lib.libCode}>
                  {lib.libName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          onClick={handleFindLibraryLink}
          variant="outline"
          className="shrink-0 cursor-pointer border-green-500"
        >
          📍 지도에서 도서관 찾기
        </Button>
      </div>

      {/* 기본 탭 라디오 */}
      <div className="mt-6 flex items-center gap-6 px-3">
        <span className="text-sm font-medium">기본 탭:</span>
        <RadioGroup
          value={defaultTab}
          onValueChange={(v: string) => {
            setDefaultTab(v as "region" | "library");
            setIsSaved(false);
          }}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="region" id="tab-region" />
            <Label htmlFor="tab-region" className="cursor-pointer text-sm">
              지역
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="library" id="tab-library" />
            <Label htmlFor="tab-library" className="cursor-pointer text-sm">
              도서관
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end gap-2 pt-4">
        {isSaved && (
          <div className="flex items-center justify-center px-2 text-base text-green-600">
            저장 완료 ✓
          </div>
        )}
        <Button
          onClick={handleSave}
          variant="default"
          disabled={!canSave}
          className="cursor-pointer bg-green-500 px-4 py-2 hover:bg-green-400"
        >
          저장하기
        </Button>
      </div>
    </div>
  );
}
