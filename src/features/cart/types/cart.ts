// 장바구니는 교재 타입(Book)에 의존하지 않고 필요한 값만 자체 타입으로 보관
export type CartItem = {
  id: number; // 상품 id
  title: string;
  category: string; // 표시용 분류 (예: 패스, 단품)
  thumbnailUrl: string | null;
  originalPrice: number; // 정가
  unitPrice: number; // 할인 적용가
  quantity: number;
};

export type CartItemInput = Omit<CartItem, "quantity">;

// added: 새로 담김 / increased: 이미 있어 수량 증가 / max: 최대 수량이라 변화 없음
export type AddResult = "added" | "increased" | "max";
