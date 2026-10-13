// 로그인이 없으므로 읽은 공지 id 목록을 localStorage에 저장
const STORAGE_KEY = "hidden-kice-notice-read-ids";

let readIds: number[] = [];
let isLoaded = false;
const listeners = new Set<() => void>();

function save() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
  } catch {
    // 저장 실패(시크릿 모드 등)해도 화면 상태는 유지
  }
  listeners.forEach((listener) => listener());
}

export const noticeReadStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot() {
    if (!isLoaded) {
      try {
        readIds = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
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
    if (readIds.includes(id)) return;
    readIds = [...readIds, id];
    save();
  },

  markAllRead(ids: number[]) {
    readIds = [...new Set([...readIds, ...ids])];
    save();
  },
};
