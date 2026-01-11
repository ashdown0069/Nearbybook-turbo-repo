import { Metadata } from "next";

export const metadata: Metadata = {
  title: "내 주변 도서관 찾기",
  description:
    "지도에서 내 위치 주변의 공공 도서관 위치와 정보를 한눈에 확인하세요.",
  openGraph: {
    title: "내 주변 도서관 찾기 | Nearby Books",
    description: "지도에서 내 주변 도서관 찾기",
    url: "https://nearbybook.kr/map/libs",
  },
  alternates: {
    canonical: "/map/libs",
  },
};

export default function LibsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
