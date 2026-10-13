import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartButton from "@/features/cart/components/CartButton";
import { Toaster } from "sonner";
import NoticeButton from "@/features/notices/components/NoticeButton";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  weight: "45 920",
  display: "swap",
  variable: "--font-pretendard",
});

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
    <html lang="ko" className={pretendard.variable}>
      <body className="flex min-h-dvh flex-col antialiased">
        <Header cartSlot={<CartButton />} noticeSlot={<NoticeButton />} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-center"
          richColors
          duration={2500}
          toastOptions={{ classNames: { toast: "font-sans" } }}
        />
      </body>
    </html>
  );
}
