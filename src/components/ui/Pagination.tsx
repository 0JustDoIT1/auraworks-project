import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const MAX_VISIBLE_PAGES = 5;

// 현재 페이지를 가운데에 두고 좌우로 2개씩
function getPageNumbers(current: number, total: number) {
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + MAX_VISIBLE_PAGES - 1);
  start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const BASE_BUTTON =
  "flex size-7 cursor-pointer items-center justify-center rounded border text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="페이지 이동" className={className}>
      <ul className="flex items-center justify-center gap-1.5">
        <li>
          <button
            type="button"
            aria-label="이전 페이지"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`${BASE_BUTTON} border-primary/30 text-primary hover:bg-primary/10`}
          >
            <ChevronLeft size={14} />
          </button>
        </li>

        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <li key={page}>
              <button
                type="button"
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => onPageChange(page)}
                className={`${BASE_BUTTON} ${
                  isCurrent
                    ? "border-primary bg-primary font-semibold text-white"
                    : "border-primary/30 text-primary hover:bg-primary/10"
                }`}
              >
                {page}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            aria-label="다음 페이지"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`${BASE_BUTTON} border-primary/30 text-primary hover:bg-primary/10`}
          >
            <ChevronRight size={14} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
