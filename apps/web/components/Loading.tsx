import React from "react";
import LoadingSpinner from "./common/LoadingSpinner";

export default function LoadingScreen({
  text = "데이터를 불러오는 중...",
}: {
  text?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white font-sans text-green-500">
      <LoadingSpinner />
      <p className="mt-6 text-lg text-green-600">{text}</p>
    </div>
  );
}
