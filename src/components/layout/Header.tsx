import type { ReactNode } from "react";
import Link from "next/link";
import HeaderNav from "./HeaderNav";
import MyPageButton from "./MyPageButton";

type HeaderProps = {
  // 기능 버튼은 app/layout에서 주입 (layout → feature 의존 방지)
  cartSlot?: ReactNode;
  noticeSlot?: ReactNode;
};

export default function Header({ cartSlot, noticeSlot }: HeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="container-page flex h-20 items-center">
        {/* 로고 */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-primary"
        >
          HIDDEN KICE
        </Link>

        {/* 네비게이션 (Client Component) */}
        <HeaderNav />

        {/* 아이콘 */}
        <div className="ml-auto flex items-center gap-6 text-gray-700">
          {cartSlot}
          {noticeSlot}
          <MyPageButton />
        </div>
      </div>
    </header>
  );
}
