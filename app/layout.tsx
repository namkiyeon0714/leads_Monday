import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "리드 수집",
  description: "문의 및 리드 수집 페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
