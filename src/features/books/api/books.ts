import { SAMPLE_BOOKS } from "../sample";
import type { BookListResult, BookQuery } from "../types";

export async function fetchBooks({
  keyword,
  type,
  page,
  pageSize,
}: BookQuery): Promise<BookListResult> {
  const cleanKeyword = keyword.trim().toLowerCase();

  const filtered = SAMPLE_BOOKS.filter(
    (book) =>
      (type === "all" || book.type === type) &&
      (cleanKeyword === "" ||
        book.title.toLocaleLowerCase().includes(cleanKeyword)),
  );

  const start = (page - 1) * pageSize;

  return {
    books: filtered.slice(start, start + pageSize),
    totalCount: filtered.length,
  };
}
