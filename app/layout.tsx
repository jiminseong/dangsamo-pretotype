import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "당사모 Pretotype",
  description: "과장광고 판별 페이크도어 (알파 대기자 수집)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-gradient-to-b from-white to-gray-50 text-gray-900">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
