export type BookType = "single" | "pass";

export type Book = {
  id: number;
  title: string;
  type: BookType;
  price: number;
  salePercent: number | null;
  thumbnailUrl: string | null;
};

export const BOOK_TYPE_LABEL: Record<BookType, string> = {
  single: "단품",
  pass: "패스",
};
