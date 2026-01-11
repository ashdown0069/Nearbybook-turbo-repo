import { AlertCircle } from "lucide-react";
import React from "react";

export default function SearchSummary({ numFound }: { numFound: number }) {
  return (
    <div className="my-5">
      <div className="p-2 text-center text-xl">
        총 <span className="text-green-500">{numFound}</span>
        개의 책이 검색되었습니다.
      </div>
      {numFound > 50 && (
        <div className="flex items-center justify-baseline gap-2 p-2 text-sm text-gray-400">
          <AlertCircle /> 검색결과가 너무 많다면 정확한 제목을 입력하시거나
          ISBN을 사용하여 검색하세요.
        </div>
      )}
    </div>
  );
}
