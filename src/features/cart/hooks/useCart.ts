import { useSyncExternalStore } from "react";
import { cartStore } from "../constants/store";

export function useCart() {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );

  let totalOriginalPrice = 0;
  let totalPrice = 0;
  for (const item of items) {
    totalOriginalPrice += item.originalPrice * item.quantity;
    totalPrice += item.unitPrice * item.quantity;
  }

  return {
    items,
    itemCount: items.length, // 배지에는 상품 종류 수 표시
    totalOriginalPrice,
    totalDiscount: totalOriginalPrice - totalPrice,
    totalPrice,
    addItem: cartStore.add,
    updateQuantity: cartStore.updateQuantity,
    removeItem: cartStore.remove,
    clearCart: cartStore.clear,
  };
}
