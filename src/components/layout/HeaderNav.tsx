"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "스토어", href: "/" },
  { label: "AI OMR WORK", href: "#" },
  { label: "챌린지", href: "#" },
  { label: "히든카이스 소개", href: "#" },
];

// "/"는 정확히 일치할 때만, 나머지는 하위 경로까지 활성 처리
function isActivePath(pathname: string, href: string) {
  if (href === "#") return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="주요 메뉴" className="ml-24 hidden md:block">
      <ul className="flex items-center gap-8">
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive = isActivePath(pathname, href);
          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`text-[17px] font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
