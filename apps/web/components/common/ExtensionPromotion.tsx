"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ExtensionPromotion({
  className,
}: {
  className?: string;
}) {
  const [extensionStoreUrl, setExtensionStoreUrl] = useState<string>();
  useEffect(() => {
    //whale 브라우저일 경우 웨일스토어로 이동
    //아니면 크롬 웹스토어로 이동
    const agent = window.navigator.userAgent;
    if (agent.includes("Whale")) {
      setExtensionStoreUrl(process.env.NEXT_PUBLIC_EXTENSION_WHALE_STORE_URL);
    } else {
      setExtensionStoreUrl(process.env.NEXT_PUBLIC_EXTENSION_STORE_URL);
    }
  }, []);
  return (
    <Link
      href={extensionStoreUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-100",
        className,
      )}
    >
      <div className="flex items-center">
        <span className="mr-4 text-xl">🚀</span>
        <p className="text-sm text-gray-700">
          온라인 서점에서 보고 있는 책, 집 근처 공공도서관에 있을까요? <br />{" "}
          <strong>확장 프로그램</strong>으로 1초 만에 확인해보세요!
        </p>
      </div>
    </Link>
  );
}
