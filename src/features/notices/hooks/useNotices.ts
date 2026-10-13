import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { fetchNotices } from "../api/notices";
import { noticeReadStore } from "../store/noticeReadStore";
import type { Notice } from "../types/notices";

type FetchState = {
  key: number; // 어떤 요청(reloadCount)의 응답인지
  data: Notice[] | null;
  error: Error | null;
};

const INITIAL_STATE: FetchState = { key: -1, data: null, error: null };

export function useNotices() {
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState<FetchState>(INITIAL_STATE);

  // 읽은 공지 id 목록 (서버 렌더링 중에는 null)
  const readIds = useSyncExternalStore<number[] | null>(
    noticeReadStore.subscribe,
    noticeReadStore.getSnapshot,
    noticeReadStore.getServerSnapshot,
  );

  // 공지 조회 (reloadCount가 바뀌면 다시 조회)
  useEffect(() => {
    let isCancelled = false; // 늦게 도착한 이전 요청의 응답 무시

    fetchNotices()
      .then((data) => {
        if (!isCancelled) setState({ key: reloadCount, data, error: null });
      })
      .catch((err: unknown) => {
        if (isCancelled) return;
        setState((prev) => ({
          key: reloadCount,
          data: prev.data,
          error: err instanceof Error ? err : new Error("Unknown Error"),
        }));
      });

    return () => {
      isCancelled = true;
    };
  }, [reloadCount]);

  const notices = state.data ?? [];

  // 서버 렌더링 중(null)에는 전부 읽음으로 취급 → 배지 없이 시작
  const isRead = (id: number) => readIds === null || readIds.includes(id);
  const unreadCount = notices.filter((notice) => !isRead(notice.id)).length;

  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);

  return {
    notices,
    unreadCount,
    isRead,
    isLoading: state.key !== reloadCount,
    error: state.key === reloadCount ? state.error : null,
    refetch,
    markRead: noticeReadStore.markRead,
    markAllRead: () => noticeReadStore.markAllRead(notices.map((n) => n.id)),
  };
}
