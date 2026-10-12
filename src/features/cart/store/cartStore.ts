// 로그인이 없으므로 브라우저(localStorage)에 저장.

import type { AddResult, CartItem, CartItemInput } from "../types/cart";

const STORAGE_KEY = "hidden-kice-cart";
const MAX_QUANTITY = 99;
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let isLoaded = false;
const listeners = new Set<() => void>();

function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "title" in value &&
    typeof value.title === "string" &&
    "category" in value &&
    typeof value.category === "string" &&
    "thumbnailUrl" in value &&
    (typeof value.thumbnailUrl === "string" || value.thumbnailUrl === null) &&
    "originalPrice" in value &&
    typeof value.originalPrice === "number" &&
    "unitPrice" in value &&
    typeof value.unitPrice === "number" &&
    "quantity" in value &&
    typeof value.quantity === "number"
  );
}

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    // 손상되거나 형식이 다른 데이터는 버림
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeStorage(next: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 시크릿 모드·용량 초과 등: 화면 상태는 유지하고 저장만 생략
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function setItems(next: CartItem[]) {
  items = next; // 항상 새 배열 → useSyncExternalStore가 변경을 감지
  writeStorage(next);
  emit();
}

// 다른 탭에서 바뀐 장바구니 반영
function handleStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  items = readStorage();
  emit();
}

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));

export const cartStore = {
  subscribe(listener: () => void) {
    if (listeners.size === 0) window.addEventListener("storage", handleStorage);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0)
        window.removeEventListener("storage", handleStorage);
    };
  },

  getSnapshot(): CartItem[] {
    if (!isLoaded) {
      items = readStorage();
      isLoaded = true;
    }
    return items;
  },

  // 서버 렌더링·hydration 시에는 빈 장바구니 → 이후 브라우저 값으로 교체
  getServerSnapshot(): CartItem[] {
    return EMPTY;
  },

  // 결과를 돌려줘서 호출한 쪽이 상황별 메시지를 보여줄 수 있게 함
  add(input: CartItemInput, quantity = 1): AddResult {
    const current = cartStore.getSnapshot();
    const existing = current.find((item) => item.id === input.id);

    if (!existing) {
      setItems([...current, { ...input, quantity: clampQuantity(quantity) }]);
      return "added";
    }
    if (existing.quantity >= MAX_QUANTITY) return "max";

    setItems(
      current.map((item) =>
        item.id === input.id
          ? {
              ...item,
              ...input,
              quantity: clampQuantity(item.quantity + quantity),
            }
          : item,
      ),
    );
    return "increased";
  },

  updateQuantity(id: number, quantity: number) {
    setItems(
      cartStore
        .getSnapshot()
        .map((item) =>
          item.id === id
            ? { ...item, quantity: clampQuantity(quantity) }
            : item,
        ),
    );
  },

  remove(id: number) {
    setItems(cartStore.getSnapshot().filter((item) => item.id !== id));
  },

  clear() {
    setItems(EMPTY);
  },
};

export { MAX_QUANTITY };
