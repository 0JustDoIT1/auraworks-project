"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import { BOOK_TYPE_LABEL, type Book } from "../types/books";
import { getBookPrice } from "../utils/pricing";
import { formatPrice } from "@/lib/utils/format";

type BookDetailModalProps = {
  book: Book | null; // null이면 닫힘
  onClose: () => void;
  onAddToCart?: (book: Book) => void;
};

export default function BookDetailModal({
  book,
  onClose,
  onAddToCart,
}: BookDetailModalProps) {
  const price = book ? getBookPrice(book) : null;

  const handleAddToCart = () => {
    if (!book || !onAddToCart) return;
    onAddToCart(book);
    onClose();
  };

  return (
    <Dialog
      open={book !== null}
      onClose={onClose}
      title="상품 정보"
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!onAddToCart}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart size={18} />
            장바구니 담기
          </button>
        </div>
      }
    >
      {book && price ? (
        <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-8 md:p-8">
          {/* 이미지 */}
          <div className="relative aspect-[4/5] overflow-hidden rounded border border-gray-200 bg-white">
            {book.thumbnailUrl ? (
              <Image
                src={book.thumbnailUrl}
                alt={book.title}
                fill
                sizes="(min-width: 768px) 360px, 100vw"
                className="object-contain p-[6%]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                이미지 준비 중
              </div>
            )}
          </div>

          {/* 정보 */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">
              {BOOK_TYPE_LABEL[book.type]}
            </span>
            <h3 className="mt-1 text-xl font-semibold md:text-2xl">
              {book.title}
            </h3>

            <div className="mt-6 border-t border-gray-100 pt-6">
              {price.hasDiscount ? (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    {formatPrice(price.originalPrice)}
                  </p>
                  <p className="mt-1 text-2xl">
                    <span className="mr-2 font-semibold text-accent">
                      {price.discountRate}%
                    </span>
                    <span className="font-bold">
                      {formatPrice(price.finalPrice)}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold">
                  {formatPrice(price.originalPrice)}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
