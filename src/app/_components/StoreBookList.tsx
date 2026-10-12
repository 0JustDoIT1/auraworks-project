"use client";

import { toast } from "sonner";
import BookList from "@/features/books/components/BookList";
import { BOOK_TYPE_LABEL, type Book } from "@/features/books/types/books";
import { useCart } from "@/features/cart/hooks/useCart";
import { AddResult } from "@/features/cart/types/cart";
import { getBookPrice } from "@/features/books/constants/pricing";

const ADD_TOAST: Record<AddResult, () => void> = {
  added: () => toast.success("장바구니에 담았습니다."),
  increased: () => toast.success("이미 담긴 상품이라 수량을 1개 늘렸습니다."),
  max: () => toast.warning("최대 수량(99개)까지 담겨 있습니다."),
};

// 교재 목록(books)과 장바구니(cart)를 연결하는 조합 지점
export default function StoreBookList() {
  const { addItem } = useCart();

  const handleAddToCart = (book: Book) => {
    const { originalPrice, finalPrice } = getBookPrice(book);
    const result = addItem({
      id: book.id,
      title: book.title,
      category: BOOK_TYPE_LABEL[book.type],
      thumbnailUrl: book.thumbnailUrl,
      originalPrice,
      unitPrice: finalPrice,
    });
    ADD_TOAST[result]();
  };

  return <BookList onAddToCart={handleAddToCart} />;
}
