import type { Book } from "../types/books";
import BookCard from "./BookCard";

type BookGridProps = {
  books: Book[];
  emptyMessage?: string;
  onSelectBook?: (book: Book) => void;
};

export default function BookGrid({
  books,
  emptyMessage = "등록된 교재가 없습니다.",
  onSelectBook,
}: BookGridProps) {
  if (books.length === 0) {
    return (
      <p className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[4vw] md:grid-cols-3 lg:grid-cols-4 lg:gap-x-[6.5vw]">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard book={book} onSelect={onSelectBook} />
        </li>
      ))}
    </ul>
  );
}
