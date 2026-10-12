import type { Book } from "../types";
import BookCard from "./BookCard";

type BookGridProps = {
  books: Book[];
};

export default function BookGrid({ books }: BookGridProps) {
  if (books.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-gray-500">
        등록된 교재가 없습니다.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard book={book} />
        </li>
      ))}
    </ul>
  );
}
