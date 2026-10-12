import { createSeededRandom } from "@/lib/random";
import type { Book } from "./types";

const random = createSeededRandom(2026);

export const SAMPLE_BOOKS: Book[] = Array.from({ length: 12 }, (_, i) => {
  const isPass = random() < 0.5;

  return {
    id: i + 1,
    title: "2026 Hidden Kice 시즌7",
    type: isPass ? "pass" : "single",
    price: isPass ? 76000 : 40000,
    salePercent: isPass ? 5 : null,
    thumbnailUrl: isPass
      ? "/images/hidden_set.png"
      : "/images/hidden_single.jpg",
  };
});
