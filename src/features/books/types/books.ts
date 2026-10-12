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

export type BookFilter = "all" | BookType;

export type BookQuery = {
  keyword: string;
  type: BookFilter;
  page: number;
  pageSize: number;
};

export type BookListResult = {
  books: Book[];
  totalCount: number;
};

// DB (books 테이블) 컬럼 타입
export type BookRow = {
  id: number;
  title: string;
  type: BookType;
  price: number;
  sale_percent: number | null;
  thumbnail_url: string | null;
};
