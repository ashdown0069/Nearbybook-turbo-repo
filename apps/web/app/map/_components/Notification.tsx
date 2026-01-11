"use client";
import { Info, MapPin, ShieldCheck } from "lucide-react";
import React from "react";

export default function Notification() {
  return (
    <div>
      <h3 className="mb-2 flex items-center text-base font-bold text-gray-800">
        <Info className="mr-2 h-5 w-5 text-blue-500" />
        지도 검색 안내
      </h3>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
          <div>
            <strong className="font-semibold text-gray-700">위치정보</strong>
            <p className="mt-0.5 text-xs">
              사용자의 위치 좌표는 서버로 전송되지 않습니다.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          <div>
            <strong className="font-semibold text-gray-700">
              정확한 검색 TIP
            </strong>
            <p className="mt-0.5 text-xs">
              검색은 지도 중앙을 기준으로 이루어집니다. 원하는 지역이 중앙에
              오도록 지도를 이동해주세요.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-1 text-xs text-gray-500">
              <li>
                <strong className="text-gray-600">대도시:</strong> '구' 단위로
                검색
              </li>
              <li>
                <strong className="text-gray-600">그 외 지역:</strong> '시' 또는
                '군' 단위로 검색
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
