import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@repo/ui/components/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import setupPreconnect from "@/lib/setupPreconnect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nearbybook.kr"),
  title: {
    default: "Nearby Books | 우리 동네 도서관 책 찾기",
    template: "%s | Nearby Books",
  },
  description:
    "읽고 싶은 책이 우리 동네 공공 도서관에 있는지 검색하거나 집 근처 도서관을 찾아보세요.",
  keywords: [
    "도서관",
    "책",
    "도서",
    "공공 도서관",
    "책 소장 도서관 찾기",
    "ISBN 검색",
    "도서 검색",
    "도서관 위치",
  ],
  openGraph: {
    title: "Nearby Books | 우리 동네 도서관 책 찾기",
    description: "집 근처 공공 도서관에서 읽고 싶은 책을 찾아보세요.",
    url: "https://nearbybook.kr",
    siteName: "Nearby Books",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: "../public/logo.png",
    title: "Nearby Books | 우리 동네 도서관 책 찾기",
    description: "집 근처 공공 도서관에서 읽고 싶은 책을 찾아보세요.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "naver-site-verification": "fd7a5241bb1117aa50198b99b3a8793bd94c553e",
    "google-site-verification": "NuiHvK8Jv1J0x3YNrz-vO08kJnbRtIHjyBAf1B6AnTE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  setupPreconnect();
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors position="top-center" />
        <QueryProvider>{children}</QueryProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
        {process.env.NODE_ENV === "production" && <SpeedInsights />}
      </body>
    </html>
  );
}
