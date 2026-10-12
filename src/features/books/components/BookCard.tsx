import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";
import { BOOK_TYPE_LABEL, Book } from "../types/books";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  const { title, type, price, salePercent, thumbnailUrl } = book;
  const discountRate =
    salePercent !== null && salePercent > 0 && salePercent < 100
      ? salePercent
      : 0;
  const hasDiscount = discountRate > 0;
  const finalPrice = Math.round((price * (100 - discountRate)) / 100);

  return (
    <article className="group cursor-pointer">
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
        <span className="text-md font-bold text-gray-400">
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
