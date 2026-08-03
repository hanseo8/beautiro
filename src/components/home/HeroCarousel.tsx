"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { CoverImage } from "@/components/ui/CoverImage";
import { heroSlideImages } from "@/lib/media";

export function HeroCarousel() {
  const t = useTranslations("home.carousel");
  const slides = t.raw("slides") as {
    title: string;
    subtitle: string;
    cta: string;
    href: string;
    tone: "sky" | "blue" | "ice";
  }[];

  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];
  const image = heroSlideImages[index] ?? heroSlideImages[0];

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  return (
    <section className="relative">
      <div className="relative min-h-[220px] overflow-hidden rounded-2xl sm:min-h-[280px]">
        <CoverImage
          src={image}
          alt={slide.title}
          priority
          sizes="(max-width: 1080px) 100vw, 1080px"
          className="transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/75 via-[#0f172a]/50 to-[#2563eb]/40" />
        <div className="relative px-8 py-12 text-white sm:px-12 sm:py-16">
          <p className="text-sm font-medium text-white/90">{slide.subtitle}</p>
          <h2 className="mt-3 max-w-md text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
            {slide.title}
          </h2>
          <Link
            href={slide.href}
            className="mt-8 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-beautiro-primary-deep hover:bg-white/95"
          >
            {slide.cta}
          </Link>
        </div>
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
        <span className="absolute bottom-4 right-5 z-10 rounded-md bg-white/25 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
          {index + 1} / {slides.length}
        </span>
      </div>
    </section>
  );
}
