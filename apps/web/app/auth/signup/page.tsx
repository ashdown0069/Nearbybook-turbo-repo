"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignup } from "@repo/data-access";
import { setAuthCookies } from "@/lib/auth";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

const signupSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
    .min(8, "비밀번호는 8자 이상이어야 합니다"),
  nickname: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      nickname: "",
    },
  });

  const signupMutation = useSignup(axiosInstance, {
    onSuccess: (data) => {
      setAuthCookies(data.accessToken, data.refreshToken);
      router.push("/");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="bg-card w-full max-w-md border-0 shadow-xl">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-center text-2xl font-semibold tracking-tight">
            회원가입
          </CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            NearbyBook 계정을 만들어보세요
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="8자 이상 입력"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      최소 8자 이상 입력해주세요
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      닉네임{" "}
                      <span className="text-muted-foreground font-normal">
                        (선택)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="사용할 닉네임"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {signupMutation.error && (
                <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
                  <p className="text-destructive text-sm">
                    {(signupMutation.error as any)?.response?.data?.message ||
                      "회원가입에 실패했습니다."}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                className="h-11 w-full text-base font-medium"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    처리 중...
                  </span>
                ) : (
                  "회원가입"
                )}
              </Button>
              <p className="text-muted-foreground text-center text-sm">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  로그인
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
