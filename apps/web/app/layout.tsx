import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import QueryProvider from "@/components/providers/QueryProvider"
import { Toaster } from "@workspace/ui/components/sonner"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import "@workspace/ui/globals.css"
import Script from "next/script"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  other: {
    "naver-site-verification": "fd7a5241bb1117aa50198b99b3a8793bd94c553e",
    "google-site-verification": "NuiHvK8Jv1J0x3YNrz-vO08kJnbRtIHjyBAf1B6AnTE",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://api.nearbybook.kr" />
        <link rel="preconnect" href="https://search.nearbybook.kr" />
        <link rel="preconnect" href="https://image.aladin.co.kr" />
        <link rel="preconnect" href="http://image.aladin.co.kr" />
        <link rel="preconnect" href="http://shopping-phinf.pstatic.net" />
        <link rel="preconnect" href="https://bookthumb-phinf.pstatic.net" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="http://nearbybook-umami-0b541c-144-24-70-70.sslip.io/script.js"
          strategy="afterInteractive"
        />
        <Toaster
          richColors
          position="top-center"
          swipeDirections={["left", "right"]}
        />
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryProvider>
        {process.env.NODE_ENV === "production" ? <Analytics /> : null}
        {process.env.NODE_ENV === "production" ? <SpeedInsights /> : null}
      </body>
    </html>
  )
}
