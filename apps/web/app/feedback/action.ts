"use server";
import { redirect } from "next/navigation";
import { sendFeedback } from "@repo/data-access";
import { axiosInstance } from "@/lib/axios";
export const submitFeedback = async (prev: any, formData: FormData) => {
  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    email: formData.get("email") as string,
  };
  if (!rawData.title) {
    return {
      isError: true,
      message: "제목을 입력해주세요.",
    };
  }
  if (!rawData.content) {
    return {
      isError: true,
      message: "내용을 입력해주세요.",
    };
  }

  try {
    await sendFeedback(
      axiosInstance,
      rawData.title,
      rawData.content,
      rawData.email,
    );
  } catch (error) {
    return {
      isError: true,
      message: "알수없는 오류가 발생했습니다.",
    };
  }
  return redirect("/feedback/thanks");
};
