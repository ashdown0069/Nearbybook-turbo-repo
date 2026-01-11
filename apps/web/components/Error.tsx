"use client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
} from "@repo/ui/components/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import React from "react";

export default function ErrorScreen({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <section className="flex h-dvh w-screen flex-col items-center justify-center bg-white">
      <Card className="mx-auto my-4 w-[90%] shadow-sm transition-all duration-200 sm:w-full sm:max-w-sm">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
          <div className="mb-2 rounded-full bg-red-50 p-3">
            <AlertCircle className="h-6 w-6 animate-pulse text-red-500" />
          </div>
          <CardTitle className="text-center text-base font-semibold text-gray-900">
            오류 안내
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="px-2 text-center text-sm break-keep text-gray-500 sm:px-4">
            데이터를 불러오지 못했습니다.
            <br className="hidden sm:block" />
            네트워크 연결을 확인하거나
            <br className="hidden sm:block" />
            잠시 후에 다시 시도해주세요.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center px-6 pt-2 pb-6">
          <Button
            variant="destructive"
            onClick={resetErrorBoundary}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
