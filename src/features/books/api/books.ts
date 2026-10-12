import { supabase } from "@/lib/supabase/client";
import type { Book, BookListResult, BookQuery, BookRow } from "../types/books";

const BOOK_COLUMNS = "id, title, type, price, sale_percent, thumbnail_url";

// DB 컬럼(snake_case) → 화면용 타입(camelCase)
function toBook(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    price: row.price,
    salePercent: row.sale_percent,
    thumbnailUrl: row.thumbnail_url,
  };
}

// ilike 패턴의 특수문자(%, _, \)를 문자 그대로 검색되게 이스케이프
function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export async function fetchBooks({
  keyword,
  type,
  page,
  pageSize,
}: BookQuery): Promise<BookListResult> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const normalizedKeyword = keyword.trim();

  let query = supabase.from("books").select(BOOK_COLUMNS, { count: "exact" });

  if (type !== "all") {
    query = query.eq("type", type);
  }
  if (normalizedKeyword) {
    query = query.ilike("title", `%${escapeLikePattern(normalizedKeyword)}%`);
  }

  const { data, error, count } = await query
    .order("id", { ascending: true })
    .range(from, to)
    .overrideTypes<BookRow[], { merge: false }>();

  if (error) {
    throw new Error(`[fetchBooks] ${error.message}`);
  }

  return {
    books: (data ?? []).map(toBook),
    totalCount: count ?? 0,
  };
}
