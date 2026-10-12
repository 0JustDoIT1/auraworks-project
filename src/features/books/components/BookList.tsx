"use client";

import { useEffect, useRef, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import { useBooks } from "../hooks/useBooks";
import type { Book, BookFilter } from "../types/books";
import BookDetailModal from "./BookDetailModal";
import BookGrid from "./BookGrid";
import BookToolbar from "./BookToolbar";

const PAGE_SIZE = 12;

type BookListProps = {
  // 장바구니 등 다른 기능과의 연결은 바깥(app)에서 주입 → books가 cart를 직접 모름
  onAddToCart?: (book: Book) => void;
};

export default function BookList({ onAddToCart }: BookListProps) {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<BookFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const shouldScrollRef = useRef(false);

  const { books, totalCount, isLoading, error, refetch } = useBooks({
    keyword,
    type,
    page,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const isFiltered = keyword !== "" || type !== "all";

  // 새 페이지가 렌더된 뒤에 스크롤
  useEffect(() => {
    if (isLoading || !shouldScrollRef.current) return;
    shouldScrollRef.current = false;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isLoading]);

  // 검색·필터가 바뀌면 1페이지부터
  const handleSearch = (value: string) => {
    if (value === keyword) return; // 같은 검색어면 페이지 유지
    setKeyword(value);
    setPage(1);
  };

  const handleTypeChange = (value: BookFilter) => {
    setType(value);
    setPage(1);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
    shouldScrollRef.current = true;
  };

  return (
    <section
      ref={sectionRef}
      aria-label="교재 목록"
      className="container-page scroll-mt-4 py-12"
    >
      <BookToolbar
        keyword={keyword}
        type={type}
        onSearch={handleSearch}
        onFilter={handleTypeChange}
      />

      {/* 결과 영역: 상태가 바뀌어도 높이 유지 */}
      <div className="mt-6 min-h-[60vh]">
        {error ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-600">
              교재 목록을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              다시 시도
            </button>
          </div>
        ) : isLoading && books.length === 0 ? (
          <p className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
            불러오는 중...
          </p>
        ) : (
          // 재조회 중에는 이전 목록을 흐리게 유지
          <div
            aria-busy={isLoading}
            className={`transition-opacity ${isLoading ? "opacity-50" : ""}`}
          >
            <BookGrid
              books={books}
              onSelectBook={setSelectedBook}
              emptyMessage={
                isFiltered ? "조건에 맞는 교재가 없습니다." : undefined
              }
            />
          </div>
        )}
      </div>

      {totalPages > 1 ? (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      ) : null}

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onAddToCart={onAddToCart}
      />
    </section>
  );
}
