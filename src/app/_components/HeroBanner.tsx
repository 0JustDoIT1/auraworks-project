"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  ChartColumnIncreasing,
  Crosshair,
  Trophy,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Slide = {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  cta: { label: string; href: string };
  backgroundImage?: string; // 없으면 단색 배경
};

const AUTO_PLAY_MS = 5000;

// 아이콘 데이터
const FEATURES: Feature[] = [
  {
    icon: Crosshair,
    title: "실전 적중",
    description: "출제 경향을 꿰뚫는 문제",
  },
  {
    icon: ChartColumnIncreasing,
    title: "난이도별 구성",
    description: "단계별로 완성하는 실력",
  },
  { icon: Trophy, title: "검증된 결과", description: "합격생이 증명한 선택" },
];

// 임시 캐러셀 데이터
const SLIDES: Slide[] = [
  {
    id: 1,
    eyebrow: "HIDDEN KICE",
    title: "히든카이스",
    subtitle: "모두가 푸는 건 이유가 있습니다",
    description: "상위권이 선택한 문제집, 결과로 증명된 실전 대비서",
    cta: { label: "히든카이스 시리즈 보기", href: "#" },
    backgroundImage: "/images/carousel_1.png",
  },
  {
    id: 2,
    eyebrow: "2026 SEASON 7",
    title: "시즌7 출시",
    subtitle: "실전과 가장 닮은 모의고사",
    description: "최신 출제 경향을 반영한 2026 시즌 라인업",
    cta: { label: "시즌7 보러가기", href: "#" },
  },
  {
    id: 3,
    eyebrow: "AI OMR WORK",
    title: "AI 채점 분석",
    subtitle: "풀고 나면 약점이 보입니다",
    description: "OMR 한 장으로 확인하는 나의 취약 단원",
    cta: { label: "AI OMR WORK 알아보기", href: "#" },
  },
  {
    id: 4,
    eyebrow: "CHALLENGE",
    title: "히든 챌린지",
    subtitle: "함께 풀면 끝까지 갑니다",
    description: "매주 정해진 분량으로 완주하는 학습 챌린지",
    cta: { label: "챌린지 참여하기", href: "#" },
  },
  {
    id: 5,
    eyebrow: "SET PACKAGE",
    title: "세트 할인",
    subtitle: "한 번에 준비하는 실전 대비",
    description: "시리즈 세트 구매 시 할인 혜택",
    cta: { label: "세트 상품 보기", href: "#" },
  },
];

export default function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      delay: AUTO_PLAY_MS,
      stopOnInteraction: false, // 스와이프 후에도 자동 재생 유지
      stopOnMouseEnter: true, // hover 시 일시정지
    }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${total}`}
              inert={index !== selectedIndex}
              className="relative flex min-h-[440px] min-w-0 shrink-0 grow-0 basis-full md:aspect-[3/1] md:min-h-[400px]"
            >
              {/* 배경 이미지 */}
              {slide.backgroundImage ? (
                <Image
                  src={slide.backgroundImage}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover object-right"
                  priority={index === 0}
                />
              ) : null}

              {/* 텍스트 가독성용 좌측 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />

              {/* 좌측 텍스트 */}
              <div className="container-page relative flex flex-col justify-center py-12">
                <p className="flex items-center gap-3 text-[clamp(0.875rem,1.2vw,1.375rem)] font-medium tracking-[0.25em] text-accent">
                  {slide.eyebrow}
                  <span className="h-px w-[1.2em] bg-accent" />
                </p>

                <h2 className="mt-[0.4em] text-[clamp(2.75rem,4vw,4.5rem)] font-bold leading-tight">
                  {slide.title}
                </h2>
                <p className="text-[clamp(1.5rem,2.6vw,3rem)] font-light leading-tight">
                  {slide.subtitle}
                </p>
                <p className="mt-[0.8em] text-[clamp(1rem,1.2vw,1.375rem)] text-white/75">
                  {slide.description}
                </p>

                <ul className="mt-[clamp(1.5rem,2.6vw,3rem)] hidden divide-x divide-white/25 sm:flex">
                  {FEATURES.map(({ icon: Icon, title, description }) => (
                    <li
                      key={title}
                      className="flex items-center gap-3 px-[clamp(1rem,1.4vw,1.5rem)] first:pl-0"
                    >
                      <Icon
                        strokeWidth={1.5}
                        className="size-[clamp(1.75rem,2.2vw,2.5rem)] shrink-0 text-accent"
                      />
                      <div className="flex flex-col">
                        <span className="text-[clamp(0.875rem,0.95vw,1.0625rem)] font-semibold text-accent">
                          {title}
                        </span>
                        <span className="text-[clamp(0.75rem,0.8vw,0.9375rem)] text-white/85">
                          {description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <Link
                  href={slide.cta.href}
                  className="mt-[clamp(1.5rem,2.6vw,3rem)] inline-flex w-fit items-center gap-[2.5em] rounded-md border border-accent/80 px-[2em] py-[1em] text-[clamp(0.875rem,0.95vw,1.0625rem)] text-accent transition-colors hover:bg-accent hover:text-white"
                >
                  {slide.cta.label}
                  <ArrowRight className="size-[1.2em]" />
                </Link>
              </div>
            </div>
          ))}
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
