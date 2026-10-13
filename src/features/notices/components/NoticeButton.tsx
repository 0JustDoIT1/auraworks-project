"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import CountBadge from "@/components/ui/CountBadge";
import { useNotices } from "../hooks/useNotices";
import NoticeDrawer from "./NoticeDrawer";

export default function NoticeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notices,
    unreadCount,
    isRead,
    isLoading,
    error,
    refetch,
    markRead,
    markAllRead,
  } = useNotices();

  return (
    <>
      <button
        type="button"
        aria-label={
          unreadCount > 0 ? `공지사항 새 글 ${unreadCount}개` : "공지사항"
        }
        onClick={() => setIsOpen(true)}
        className="relative cursor-pointer transition-colors hover:text-primary"
      >
        <Bell size={24} strokeWidth={1.75} />
        <CountBadge count={unreadCount} />
      </button>

      <NoticeDrawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        notices={notices}
        unreadCount={unreadCount}
        isRead={isRead}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onRead={markRead}
        onReadAll={markAllRead}
      />
    </>
  );
}
