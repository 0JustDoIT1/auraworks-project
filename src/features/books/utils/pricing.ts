import { Book } from "../types/books";

// 할인 계산을 한 곳에서: 카드·상세 모달·장바구니가 같은 결과를 쓰도록
export function getBookPrice({
  price,
  salePercent,
}: Pick<Book, "price" | "salePercent">) {
  const discountRate =
    salePercent !== null && salePercent > 0 && salePercent < 100
      ? salePercent
      : 0;

  return {
    originalPrice: price,
    finalPrice: Math.round((price * (100 - discountRate)) / 100),
    discountRate,
    hasDiscount: discountRate > 0,
  };
}
