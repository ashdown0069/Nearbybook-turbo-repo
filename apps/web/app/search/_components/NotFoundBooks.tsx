import React from "react";

export default function NotFoundBooks({ title }: { title?: string }) {
  return (
    <div className="flex items-center justify-center">
      <div>
        <div className="text-center">
          {title && (
            <h3 className="py-5 text-xl font-semibold text-gray-800">
              검색 결과 없음
            </h3>
          )}
          {title && (
            <p className="mt-2 text-base text-gray-500">
              요청하신 '
              <span className="font-bold text-green-600">{title}</span>' 을(를)
              소유한 도서관을 찾지 못했습니다.
            </p>
          )}
        </div>

        <div className="mt-6 rounded-md bg-green-50 px-4 py-10">
          <h4 className="font-bold text-green-800">더 정확하게 검색하려면?</h4>
          <ul className="mt-2 list-disc space-y-3 pl-5 text-sm text-green-700">
            <li>찾고있는 책의 모든 이름을 입력하세요.</li>
            <li>
              동일한 이름의 책도 <b className="font-semibold">ISBN</b>이 다를 수
              있습니다.
            </li>
            <li>
              <b className="font-semibold"> ISBN(국제표준도서번호)</b>로
              검색하면 가장 정확한 결과를 얻을 수 있습니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
