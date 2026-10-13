// 로그인이 없으므로 읽은 공지 id 목록을 localStorage에 저장
const STORAGE_KEY = "hidden-kice-notice-read-ids";

let readIds: number[] = [];
let isLoaded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function save() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
  } catch {
    // 저장 실패(시크릿 모드 등)해도 화면 상태는 유지
  }
  notify();
}

// 다른 탭에서 읽음 처리한 경우 반영
function handleStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  isLoaded = false; // 다음 getSnapshot에서 localStorage를 다시 읽음
  notify();
}

export const noticeReadStore = {
  subscribe(listener: () => void) {
    if (listeners.size === 0) window.addEventListener("storage", handleStorage);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0)
        window.removeEventListener("storage", handleStorage);
    };
  },

  getSnapshot() {
    if (!isLoaded) {
      try {
        const parsed: unknown = JSON.parse(
          window.localStorage.getItem(STORAGE_KEY) ?? "[]",
        );
        readIds = Array.isArray(parsed)
          ? parsed.filter((id): id is number => Number.isInteger(id))
          : []; // 배열이 아니거나 숫자가 아닌 항목은 무시
      } catch {
        readIds = [];
      }
      isLoaded = true;
    }
    return readIds;
  },

  // 서버에서는 읽음 정보를 알 수 없음 → null (화면에서는 전부 읽음으로 취급)
  getServerSnapshot: () => null,

  markRead(id: number) {
    const current = noticeReadStore.getSnapshot();
    if (current.includes(id)) return;
    readIds = [...current, id];
    save();
  },

  markAllRead(ids: number[]) {
    readIds = [...new Set([...noticeReadStore.getSnapshot(), ...ids])];
    save();
  },
};
