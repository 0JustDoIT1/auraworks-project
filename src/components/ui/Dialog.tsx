"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  position?: "center" | "right";
};

const POSITION_CLASS = {
  center:
    "m-auto w-[calc(100%-2rem)] max-w-3xl max-h-[calc(100dvh-2rem)] rounded-xl",
  right: "m-0 ml-auto h-dvh max-h-none w-full max-w-md",
} as const;

// 네이티브 <dialog> 기반: 포커스 가두기·Esc 닫기·배경 처리를 브라우저가 담당
export default function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  position = "center",
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // open prop ↔ 실제 dialog 상태 동기화
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose} // Esc 포함 모든 닫힘
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // 바깥(배경) 클릭
      }}
      className={`flex-col bg-white p-0 text-gray-900 backdrop:bg-black/50 open:flex ${POSITION_CLASS[position]}`}
    >
      <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 id={titleId} className="text-base font-semibold">
          {title}
        </h2>
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="cursor-pointer text-gray-400 transition-colors hover:text-gray-900"
        >
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">{children}</div>

      {footer ? (
        <footer className="border-t border-gray-100 px-5 py-4">{footer}</footer>
      ) : null}
    </dialog>
  );
}
