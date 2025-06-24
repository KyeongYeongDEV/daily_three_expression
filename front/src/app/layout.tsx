import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "하삼영 - 하루 3개의 패턴 영어",
  description: "바쁜 직장인과 학생들을 위한 매일 아침 6시 영어 패턴 학습 서비스",
  keywords: ["영어학습", "패턴영어", "이메일학습", "직장인영어", "학생영어"],
  openGraph: {
    title: "하삼영 - 하루 3개의 패턴 영어",
    description: "출근, 등교하며 하루에 3문장만 공부해보아요!",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/title_icon.png", // 이 경로가 정확해야 합니다.
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
