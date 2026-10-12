import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartButton from "@/features/cart/components/CartButton";

export const metadata: Metadata = {
  title: "히든카이스 스토어",
  description: "HIDDEN KICE - 최고의 문제집",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-dvh flex-col antialiased">
        <Header cartSlot={<CartButton />} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
