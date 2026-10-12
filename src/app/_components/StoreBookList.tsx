"use client";

import BookList from "@/features/books/components/BookList";
import { getBookPrice } from "@/features/books/constants/pricing";
import { BOOK_TYPE_LABEL, type Book } from "@/features/books/types/books";
import { useCart } from "@/features/cart/hooks/useCart";

// 교재 목록(books)과 장바구니(cart)를 연결하는 조합 지점
export default function StoreBookList() {
  const { addItem } = useCart();

  const handleAddToCart = (book: Book) => {
    const { originalPrice, finalPrice } = getBookPrice(book);
    addItem({
      id: book.id,
      title: book.title,
      category: BOOK_TYPE_LABEL[book.type],
      thumbnailUrl: book.thumbnailUrl,
      originalPrice,
      unitPrice: finalPrice,
    });
  };

  return <BookList onAddToCart={handleAddToCart} />;
}
