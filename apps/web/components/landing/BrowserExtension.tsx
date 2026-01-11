"use client";
import { Puzzle } from "lucide-react";
import React, { useEffect, useState } from "react";
import MainPromoteCard from "./MainPromoteCard";

export default function BrowserExtension() {
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
    <MainPromoteCard
      href={extensionStoreUrl || "#"}
      target="_blank"
      icon={<Puzzle color="#05df72" />}
      title="브라우저 확장 프로그램"
      description={
        <div>
          온라인 서점 페이지에서 내가 보고있는 책이 근처에 있는지 바로
          확인하세요
          <br />
          <span className="font-semibold text-green-400">
            Chrome / Whale
          </span>{" "}
          확장 프로그램으로 바로 검색!
        </div>
      }
    />
  );
}
