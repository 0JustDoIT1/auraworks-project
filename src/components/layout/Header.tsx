import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, User, type LucideIcon } from "lucide-react";
import HeaderNav from "./HeaderNav";

type IconAction = { label: string; icon: LucideIcon };

type HeaderProps = {
  cartSlot?: ReactNode; // 장바구니 버튼은 app/layout에서 주입 (layout → feature 의존 방지)
};

// 기능 미구현: 아이콘만 표시
const ICON_ACTIONS: IconAction[] = [
  { label: "알림", icon: Bell },
  { label: "마이페이지", icon: User },
];

export default function Header({ cartSlot }: HeaderProps) {
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
          {ICON_ACTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="cursor-pointer transition-colors hover:text-primary"
            >
              <Icon size={24} strokeWidth={1.75} />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
