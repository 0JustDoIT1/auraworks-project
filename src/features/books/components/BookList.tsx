"use client";

import { useEffect, useRef, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import { useBooks } from "../hooks/useBooks";
import type { BookFilter } from "../types/books";
import BookGrid from "./BookGrid";
import BookToolbar from "./BookToolbar";

const PAGE_SIZE = 12;

export default function BookList() {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<BookFilter>("all");
  const [page, setPage] = useState(1);
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
      {/* 변경: 최소 높이 보장 */}
      <div className="mt-6 min-h-[60vh]">
        {error ? (
          // 변경: py-20 → 영역 가운데 정렬
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-600">
              교재 목록을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              다시 시도
            </button>
          </div>
        ) : isLoading && books.length === 0 ? (
          // 변경: py-20 → 영역 가운데 정렬
          <p className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
            불러오는 중...
          </p>
        ) : (
          // 유지
          <div
            aria-busy={isLoading}
            className={`transition-opacity ${isLoading ? "opacity-50" : ""}`}
          >
            <BookGrid
              books={books}
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
    </section>
  );
}
