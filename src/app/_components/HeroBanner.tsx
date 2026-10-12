"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// 이미지 기준 % 좌표 (이미지맵 영역)
type Area = { left: number; top: number; width: number; height: number };

type Slide = {
  id: number;
  image: string;
  alt: string;
  link?: { href: string; label: string; area: Area }; // 이미지 속 버튼 위치에만 클릭 영역
};

const AUTO_PLAY_MS = 5000;

// md 이상: 비율 유지한 채 가운데로 축소, 경계는 마스크로 배경과 자연스럽게 연결
const IMAGE_BOX_CLASS =
  "absolute inset-0 md:inset-[9%] md:mask-x-from-95% md:mask-y-from-95%";

// 임시 캐러셀 데이터: 실제 배너 이미지로 교체
const SLIDES: Slide[] = [
  {
    id: 1,
    image: "/images/carousel_1.png",
    alt: "히든카이스 시리즈",
    link: {
      href: "#",
      label: "히든카이스 시리즈 보기",
      area: { left: 5.69, top: 78.57, width: 16.57, height: 9.34 },
    },
  },
  { id: 2, image: "/images/carousel_1.png", alt: "시즌7 출시" },
  { id: 3, image: "/images/carousel_1.png", alt: "AI 채점 분석" },
  { id: 4, image: "/images/carousel_1.png", alt: "히든 챌린지" },
  { id: 5, image: "/images/carousel_1.png", alt: "세트 할인" },
];

export default function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      delay: AUTO_PLAY_MS,
      stopOnInteraction: false, // 스와이프 후에도 자동 재생 유지
      stopOnMouseEnter: true, // hover 시 일시정지
    }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0); // 슬라이드 번호 체크용 state
  const total = SLIDES.length;

  // Embla의 select 이벤트로 현재 인덱스 동기화
  useEffect(() => {
    if (!emblaApi) return;
    const handleSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="히든카이스 소개"
      className="relative bg-neutral-950 text-white"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {SLIDES.map((slide, index) => {
            const image = (
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            );

            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${total}`}
                inert={index !== selectedIndex}
                className="relative aspect-[3/1] min-w-0 shrink-0 grow-0 basis-full"
              >
                <div className={IMAGE_BOX_CLASS}>
                  {image}
                  {slide.link ? (
                    <Link
                      href={slide.link.href}
                      aria-label={slide.link.label}
                      className="absolute rounded-md focus-visible:outline-2 focus-visible:outline-accent"
                      style={{
                        left: `${slide.link.area.left}%`,
                        top: `${slide.link.area.top}%`,
                        width: `${slide.link.area.width}%`,
                        height: `${slide.link.area.height}%`,
                      }}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 우측 하단 페이지 표시 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6">
        <div className="container-page flex justify-end">
          <span
            aria-live="off"
            className="rounded-full bg-black/60 px-[1.2em] py-[0.4em] text-[clamp(0.875rem,1vw,1.125rem)] font-medium tabular-nums"
          >
            {selectedIndex + 1}/{total}
          </span>
        </div>
      </div>
    </section>
  );
}
