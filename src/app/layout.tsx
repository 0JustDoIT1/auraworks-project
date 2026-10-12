import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "히든카이스",
  description: "HIDDEN KICE - 최고의 문제집",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
