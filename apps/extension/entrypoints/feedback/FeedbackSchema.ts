import z from "zod";

export const FeedbackSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "제목을 입력해주세요.",
    })
    .max(100, {
      message: "제목은 100자 이하로 입력해주세요.",
    }),
  description: z
    .string()
    .min(1, {
      message: "내용을 입력해주세요.",
    })
    .max(300, {
      message: "내용은 300자 이하로 입력해주세요.",
    }),
  email: z
    .string()
    .email({ message: "올바른 이메일 형식이 아닙니다." })
    .optional(),
});
