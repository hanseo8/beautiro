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
      <div className="card-modern relative min-h-[240px] overflow-hidden sm:min-h-[300px]">
        <CoverImage
          src={image}
          alt={slide.title}
          priority
          sizes="(max-width: 1080px) 100vw, 1080px"
          className="transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-[#0f172a]/45 to-[#1a5f5f]/35" />
        <div className="relative px-8 py-12 text-white sm:px-12 sm:py-16">
          <p className="text-label text-white/70">{slide.subtitle}</p>
          <h2 className="mt-3 max-w-lg text-2xl font-bold leading-snug tracking-tight sm:text-[1.75rem]">
            {slide.title}
          </h2>
          <Link
            href={slide.href}
            className="mt-8 inline-flex h-11 items-center rounded-2xl bg-white px-6 text-sm font-bold text-beautiro-primary transition-colors hover:bg-white/95"
          >
            {slide.cta}
          </Link>
        </div>
        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
