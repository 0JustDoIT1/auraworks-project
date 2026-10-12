"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "@/lib/utils/format";
import { MAX_QUANTITY } from "../constants/store";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const STEP_BUTTON =
  "flex size-7 cursor-pointer items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent";

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const {
    items,
    itemCount,
    totalOriginalPrice,
    totalDiscount,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const isEmpty = itemCount === 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={itemCount > 0 ? `장바구니 (${itemCount})` : "장바구니"}
      position="right"
      footer={
        isEmpty ? null : (
          <div className="flex flex-col gap-4">
            <dl className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <dt>상품 금액</dt>
                <dd>{formatPrice(totalOriginalPrice)}</dd>
              </div>
              <div className="flex justify-between text-gray-500">
                <dt>할인 금액</dt>
                <dd className={totalDiscount > 0 ? "text-accent" : ""}>
                  {totalDiscount > 0 ? "-" : ""}
                  {formatPrice(totalDiscount)}
                </dd>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
                <dt className="font-semibold">결제 예정 금액</dt>
                <dd className="text-lg font-bold text-primary">
                  {formatPrice(totalPrice)}
                </dd>
              </div>
            </dl>

            {/* 결제 x */}
            <button
              type="button"
              disabled
              className="h-12 w-full cursor-not-allowed rounded-md bg-gray-200 text-sm font-semibold text-gray-500"
            >
              주문하기
            </button>
          </div>
        )
      }
    >
      {isEmpty ? (
        <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-400">
          <ShoppingCart size={40} strokeWidth={1.25} />
          <p className="text-sm">장바구니가 비어 있습니다.</p>
        </div>
      ) : (
        <div className="px-5">
          <div className="flex justify-end py-3">
            <button
              type="button"
              onClick={clearCart}
              className="cursor-pointer text-xs text-gray-400 underline-offset-2 hover:text-gray-700 hover:underline"
            >
              전체 삭제
            </button>
          </div>

          <ul className="divide-y divide-gray-100">
            {items.map((item) => {
              const hasDiscount = item.unitPrice < item.originalPrice;
              return (
                <li key={item.id} className="flex gap-4 py-4">
                  {/* 썸네일 */}
                  <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded border border-gray-200 bg-white">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-contain p-1.5"
                      />
                    ) : null}
                  </div>

                  {/* 정보 */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">{item.category}</p>
                        <p className="truncate text-sm font-medium">
                          {item.title}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`${item.title} 삭제`}
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 cursor-pointer text-gray-300 transition-colors hover:text-gray-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-3">
                      {/* 수량 */}
                      <div className="flex items-center rounded border border-gray-200">
                        <button
                          type="button"
                          aria-label="수량 줄이기"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className={STEP_BUTTON}
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          aria-label="수량"
                          className="w-8 text-center text-sm tabular-nums"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="수량 늘리기"
                          disabled={item.quantity >= MAX_QUANTITY}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className={STEP_BUTTON}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* 가격 (수량 반영) */}
                      <div className="text-right">
                        {hasDiscount ? (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(item.originalPrice * item.quantity)}
                          </p>
                        ) : null}
                        <p className="text-sm font-bold">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Dialog>
  );
}
