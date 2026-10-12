import { SAMPLE_BOOKS } from "@/features/books/sample";
import BookGrid from "@/features/books/components/BookGrid";
import HeroBanner from "./_components/HeroBanner";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <section aria-label="교재 목록" className="container-page py-12">
        <BookGrid books={SAMPLE_BOOKS} />
      </section>
    </>
  );
}
