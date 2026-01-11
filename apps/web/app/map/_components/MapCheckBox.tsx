"use client";
import Logo from "@/components/common/Logo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { SI_DO_CODE_AND_NAME } from "@/const";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@repo/ui/components/button";

type MapCheckBoxProps = {
  selectedRegions: string[];
  onRegionChange: (code: string, checked: boolean) => void;
  onToggleAll: () => void;
  isLoading?: boolean;
  isError?: boolean;
  libraryCount?: number;
  className?: string;
};

export default function MapCheckBox({
  selectedRegions,
  onRegionChange,
  onToggleAll,
  isLoading,
  isError,
  libraryCount,
  className,
}: MapCheckBoxProps) {
  const allCodes = SI_DO_CODE_AND_NAME.map((region) => region.code);
  const handleRegionChange = (code: string, checked: boolean) => {
    onRegionChange(code, checked);
  };
  const handleToggleAll = () => {
    onToggleAll();
  };
  return (
    <Collapsible defaultOpen>
      <Card className={cn("absolute top-4 left-4 w-80", className)}>
        <CollapsibleTrigger asChild>
          <CardHeader className="flex items-center justify-between gap-2 px-3">
            <Logo />
            <div className="flex flex-col items-center justify-center gap-2 pt-2">
              <CardTitle>공공 도서관 검색</CardTitle>
              <CardDescription>지역을 선택하세요.</CardDescription>
            </div>
            <Button variant={"ghost"} className="cursor-pointer">
              <ChevronsUpDown color="#364153" />
            </Button>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                className={cn(
                  "min-w-32 cursor-pointer p-3 text-xs font-semibold transition",
                  selectedRegions.length === allCodes.length && "text-gray-700",
                  selectedRegions.length !== allCodes.length &&
                    "text-green-400",
                )}
                onClick={handleToggleAll}
              >
                {selectedRegions.length === allCodes.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {SI_DO_CODE_AND_NAME.map((region) => (
                <div key={region.code} className="flex items-center gap-2">
                  <Checkbox
                    id={region.code}
                    checked={selectedRegions.includes(region.code)}
                    onCheckedChange={(checked) =>
                      handleRegionChange(region.code, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={region.code}
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {region.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
              {isLoading && selectedRegions.length > 0 && (
                <p className="text-center text-sm text-gray-500">로딩 중...</p>
              )}
              {isError && selectedRegions.length > 0 && (
                <p className="text-center text-sm text-red-500">
                  오류가 발생했습니다
                </p>
              )}
              {libraryCount !== undefined &&
                selectedRegions.length > 0 &&
                !isLoading && (
                  <p className="text-center text-sm text-gray-700">
                    {libraryCount}개의 도서관을 찾았습니다
                  </p>
                )}
              {selectedRegions.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  지역을 선택하여 도서관 정보를 표시합니다
                </p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
