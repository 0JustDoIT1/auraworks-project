"use client";

import { User } from "lucide-react";
import { toast } from "sonner";

// 로그인 미구현: 동작 없는 버튼 대신 안내 메시지
export default function MyPageButton() {
  return (
    <button
      type="button"
      aria-label="마이페이지"
      onClick={() => toast.info("로그인 기능은 준비 중입니다.")}
      className="cursor-pointer transition-colors hover:text-primary"
    >
      <User size={24} strokeWidth={1.75} />
    </button>
  );
}
