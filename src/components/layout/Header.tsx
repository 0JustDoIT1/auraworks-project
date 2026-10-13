import type { ReactNode } from "react";
import Link from "next/link";
import { User, type LucideIcon } from "lucide-react";
import HeaderNav from "./HeaderNav";

type IconAction = { label: string; icon: LucideIcon };

type HeaderProps = {
  cartSlot?: ReactNode;
  noticeSlot?: ReactNode;
};

// 기능 미구현: 아이콘만 표시
const ICON_ACTIONS: IconAction[] = [{ label: "마이페이지", icon: User }];

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
          {noticeSlot} {/* ④ 추가 */}
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
