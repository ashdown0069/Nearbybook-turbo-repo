import Link from "next/link";
import React from "react";

export default function ThanksPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md transform transition-all">
        <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            제출이 완료되었습니다!
          </h1>
          <p className="mt-3 text-base text-gray-600">
            소중한 의견을 보내주셔서 감사합니다.
          </p>
          <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link
              href="/"
              className="inline-flex justify-center rounded-md border bg-green-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-green-600"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
