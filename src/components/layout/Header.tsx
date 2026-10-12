import Link from "next/link";
import { Bell, ShoppingCart, User, type LucideIcon } from "lucide-react";
import HeaderNav from "./HeaderNav";

type IconAction = { label: string; icon: LucideIcon; count?: number };

// 임시 데이터: 장바구니·알림 기능 구현 시 실제 개수로 교체
const ICON_ACTIONS: IconAction[] = [
  { label: "장바구니", icon: ShoppingCart, count: 1 },
  { label: "알림", icon: Bell, count: 1 },
  { label: "마이페이지", icon: User },
];

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="container-page flex h-20 items-center">
        {/* 로고 */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-primary"
        >
          HIDDEN KICE
        </Link>

        {/* 네비게이션 (Client Component) */}
        <HeaderNav />

        {/* 아이콘 */}
        <div className="ml-auto flex items-center gap-6 text-gray-700">
          {ICON_ACTIONS.map(({ label, icon: Icon, count }) => (
            <button
              key={label}
              type="button"
              aria-label={count ? `${label} ${count}개` : label}
              className="relative cursor-pointer transition-colors hover:text-primary"
            >
              <Icon size={24} strokeWidth={1.75} />
              {count ? (
                <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold leading-none text-white">
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
