import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, User, type LucideIcon } from "lucide-react";
import HeaderNav from "./HeaderNav";
import CountBadge from "../ui/Badge";

type IconAction = { label: string; icon: LucideIcon; count?: number };

type HeaderProps = {
  cartSlot?: ReactNode; // 장바구니 버튼은 app/layout에서 주입 (layout → feature 의존 방지)
};

// 임시 데이터: 알림 기능 구현 시 실제 개수로 교체
const ICON_ACTIONS: IconAction[] = [
  { label: "알림", icon: Bell, count: 1 },
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
          {ICON_ACTIONS.map(({ label, icon: Icon, count = 0 }) => (
            <button
              key={label}
              type="button"
              aria-label={count > 0 ? `${label} ${count}개` : label}
              className="relative cursor-pointer transition-colors hover:text-primary"
            >
              <Icon size={24} strokeWidth={1.75} />
              <CountBadge count={count} />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
