import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";
import { BOOK_TYPE_LABEL, type Book } from "../types/books";
import { getBookPrice } from "../constants/pricing";

type BookCardProps = {
  book: Book;
  onSelect?: (book: Book) => void;
};

export default function BookCard({ book, onSelect }: BookCardProps) {
  const { title, type, price, thumbnailUrl } = book;
  const { finalPrice, discountRate, hasDiscount } = getBookPrice(book);

  return (
    <article className="group relative">
      {/* 카드 전체를 덮는 클릭 영역 (article 안에 h3 등이 있어 button으로 감싸지 않음) */}
      {onSelect ? (
        <button
          type="button"
          aria-label={`${title} 상세 보기`}
          onClick={() => onSelect(book)}
          className="absolute inset-0 z-10 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        />
      ) : null}

      {/* 썸네일 */}
      <div className="relative aspect-[4/5] overflow-hidden rounded border border-gray-200 bg-white">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-contain p-[6%] transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            이미지 준비 중
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="mt-3 flex flex-col gap-1">
        <span className="text-base font-bold text-gray-400">
          {BOOK_TYPE_LABEL[type]}
        </span>
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 md:text-base">
          {title}
        </h3>

        {hasDiscount ? (
          <>
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(price)}
            </span>
            <p className="text-sm md:text-base">
              <span className="mr-1.5 font-semibold text-accent">
                {discountRate}%
              </span>
              <span className="font-bold text-gray-900">
                {formatPrice(finalPrice)}
              </span>
            </p>
          </>
        ) : (
          <p className="text-sm font-bold text-gray-900 md:text-base">
            {formatPrice(price)}
          </p>
        )}
      </div>
    </article>
  );
}
