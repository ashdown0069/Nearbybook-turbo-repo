"use client";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { useActionState } from "react";
import { submitFeedback } from "./action";

export default function FeedbackPage() {
  const [state, action, isPending] = useActionState(submitFeedback, {
    isError: false,
    message: "",
  });
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 sm:p-24">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            피드백을 남겨주세요
          </h1>
          <p className="mt-2 text-gray-600">
            서비스 개선을 위해 여러분의 소중한 의견이 필요합니다.
          </p>
        </div>
        <form
          action={action}
          className="space-y-6 rounded-xl bg-white p-8 shadow-lg"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              제목
            </label>
            <Input
              type="text"
              id="title"
              name="title" // 'name' 속성은 서버 액션에서 데이터를 구분하는 키(key)가 됩니다.
              required
              className="w-full rounded-md px-3 py-2 placeholder-gray-400 shadow-sm"
              placeholder="제목을 입력해주세요."
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              내용
            </label>
            <Textarea
              id="content"
              name="content"
              required
              rows={8}
              maxLength={300}
              className="h-24 w-full resize-none rounded-md px-3 py-2 placeholder-gray-400 shadow-sm"
              placeholder="자세한 내용을 입력해주세요."
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              이메일 (선택 사항)
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-md px-3 py-2 placeholder-gray-400 shadow-sm"
              placeholder="답변을 받으실 이메일 주소를 입력해주세요."
            />
          </div>
          <div>
            <Button
              disabled={isPending}
              variant={"outline"}
              type="submit"
              className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-green-500 px-4 py-5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-green-600 hover:text-white"
            >
              피드백 제출하기
            </Button>

            {state?.isError && (
              <p className="mt-3 pl-2 text-red-500">{state.message}</p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
