import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { FeedbackSchema } from "./FeedbackSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { sendFeedback } from "@repo/data-access";
import { RotateCcw } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

export default function FeedbackForm() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      title: "",
      description: "",
      email: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof FeedbackSchema>) => {
    try {
      setSubmitStatus(() => "pending");
      await sendFeedback(
        axiosInstance,
        data.title,
        data.description,
        data.email,
      );
      form.reset();
      alert("제출이 완료되었습니다.");
      setSubmitStatus(() => "success");
    } catch (error) {
      setSubmitStatus(() => "error");
    }
  };
  if (submitStatus === "error") {
    return (
      <section className="flex h-screen items-center justify-center">
        <div className="p-2 text-sm">
          <Button
            className="mx-auto mt-2 flex w-[200px] cursor-pointer justify-center bg-green-500 text-white hover:bg-green-400 hover:text-white"
            onClick={() => {
              window.location.reload();
            }}
            variant="ghost"
          >
            <RotateCcw />
            새로고침
          </Button>
        </div>
      </section>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl after:text-red-500 after:content-['*']">
                제목
              </FormLabel>
              <FormDescription>
                기능제안, 버그제보 등 내용을 간단히 요약해주세요
              </FormDescription>
              <FormControl>
                <Input className="w-2/3 text-base" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl after:text-red-500 after:content-['*']">
                상세설명
              </FormLabel>
              <FormDescription>
                발생한 오류를 상세히 설명해주시거나 원하는 기능이 있다면
                제안해주세요.
              </FormDescription>
              <FormControl>
                <Textarea
                  maxLength={300}
                  className="h-24 w-full resize-none text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Email</FormLabel>
              <FormDescription>답변을 받을 이메일 주소</FormDescription>
              <FormControl>
                <Input
                  className="w-2/3 text-base"
                  placeholder="test@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={submitStatus === "pending"}
          type="submit"
          className="w-full cursor-pointer bg-green-500 px-4 py-3.5 text-base hover:bg-green-400"
        >
          제출하기
        </Button>
      </form>
    </Form>
  );
}
