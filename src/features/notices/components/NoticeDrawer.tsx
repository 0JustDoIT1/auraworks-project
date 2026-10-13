"use client";

import { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import { formatDate } from "@/lib/utils/format";
import type { Notice } from "../types/notices";

type NoticeDrawerProps = {
  open: boolean;
  onClose: () => void;
  notices: Notice[];
  unreadCount: number;
  isRead: (id: number) => boolean;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  onRead: (id: number) => void;
  onReadAll: () => void;
};

export default function NoticeDrawer({
  open,
  onClose,
  notices,
  unreadCount,
  isRead,
  isLoading,
  error,
  onRetry,
  onRead,
  onReadAll,
}: NoticeDrawerProps) {
  const [openId, setOpenId] = useState<number | null>(null); // 펼쳐진 공지 (한 번에 하나)

  // 펼칠 때 읽음 처리, 다시 누르면 접힘
  const handleToggle = (id: number) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    onRead(id);
  };

  return (
    <Dialog open={open} onClose={onClose} title="공지사항" position="right">
      {error ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-sm text-gray-600">
            공지사항을 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            다시 시도
          </button>
        </div>
      ) : isLoading && notices.length === 0 ? (
        <p className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
          불러오는 중...
        </p>
      ) : notices.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-400">
          <Bell size={40} strokeWidth={1.25} />
          <p className="text-sm">등록된 공지가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-end px-5 py-3">
            <button
              type="button"
              onClick={onReadAll}
              disabled={unreadCount === 0}
              className="cursor-pointer text-xs text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline disabled:cursor-default disabled:text-gray-300 disabled:no-underline"
            >
              모두 읽음
            </button>
          </div>

          <ul className="divide-y divide-gray-100 border-t border-gray-100">
            {notices.map((notice) => {
              const isOpen = openId === notice.id;
              const isUnread = !isRead(notice.id);
              const contentId = `notice-content-${notice.id}`;

              return (
                <li key={notice.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => handleToggle(notice.id)}
                    className="flex w-full cursor-pointer items-start gap-3 px-5 py-4 text-left hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {isUnread ? (
                          <span className="shrink-0 rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                            NEW
                          </span>
                        ) : null}
                        <span
                          className={`truncate text-sm ${
                            isUnread
                              ? "font-semibold text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notice.title}
                        </span>
                      </div>
                      <time
                        dateTime={notice.createdAt}
                        className="mt-1 block text-xs text-gray-400"
                      >
                        {formatDate(notice.createdAt)}
                      </time>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`mt-0.5 shrink-0 text-gray-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen ? (
                    <p
                      id={contentId}
                      className="whitespace-pre-line bg-gray-50 px-5 py-4 text-sm leading-relaxed text-gray-700"
                    >
                      {notice.content}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Dialog>
  );
}
