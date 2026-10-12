"use client";

import { useState, type SubmitEvent } from "react";
import { Search, X } from "lucide-react";
import type { BookFilter } from "../types/books";

type BookToolbarProps = {
  keyword: string;
  type: BookFilter;
  onSearch: (keyword: string) => void;
  onFilter: (type: BookFilter) => void;
};

const FILTER_OPTIONS: { value: BookFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "pass", label: "패스" },
  { value: "single", label: "단품" },
];

export default function BookToolbar({
  keyword,
  type,
  onSearch,
  onFilter,
}: BookToolbarProps) {
  const [searchKey, setSearchKey] = useState<string>(keyword);

  // 입력 즉시 검색
  const handleChange = (value: string) => {
    setSearchKey(value);
    onSearch(value.trim());
  };

  // Enter로도 검색
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchKey.trim());
  };

  const handleClear = () => {
    setSearchKey("");
    onSearch("");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
      {/* 검색 */}
      <form role="search" onSubmit={handleSubmit} className="relative sm:w-64">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          value={searchKey}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="검색"
          aria-label="교재 검색"
          className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-8 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary [&::-webkit-search-cancel-button]:hidden"
        />
        {searchKey ? (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        ) : null}
      </form>

      {/* 유형 필터 */}
      <ul className="flex items-center divide-x divide-gray-300 text-sm">
        {FILTER_OPTIONS.map(({ value, label }) => {
          const isActive = value === type;
          return (
            <li key={value} className="px-3 leading-none last:pr-0">
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onFilter(value)}
                className={
                  isActive
                    ? "font-semibold text-gray-900"
                    : "text-gray-400 hover:text-gray-700"
                }
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
