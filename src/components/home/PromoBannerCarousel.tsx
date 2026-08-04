"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Gift,
  Plane,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/ui/CoverImage";
import { promoBannerImages } from "@/lib/media";

export type PromoSlide =
  | {
      type: "openPromo";
      badge: string;
      title: string;
      subtitle: string;
      ctaEvents: string;
      ctaBook: string;
      benefits: { title: string; desc: string }[];
    }
  | {
      type: "cosmetics";
      badge: string;
      title: string;
      subtitle: string;
      note: string;
      cta: string;
    };

export function PromoBannerCarousel({ slides }: { slides: PromoSlide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];
  const image = promoBannerImages[index] ?? promoBannerImages[0];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  const benefitIcons = [Wallet, Plane, Building2];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
      <div className="relative min-h-[300px] sm:min-h-[340px]">
        <CoverImage
          src={image}
          alt={slide.title}
          priority
          sizes="(max-width: 1080px) 100vw, 1080px"
          className="transition-transform duration-700 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/88 via-[#0f172a]/55 to-[#0f172a]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-[#0f172a]/20" />

        <div className="relative flex min-h-[300px] flex-col justify-end p-6 sm:min-h-[340px] sm:p-8">
          {slide.type === "openPromo" ? (
            <>
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                <Sparkles size={12} />
                {slide.badge}
              </div>
              <h2 className="font-display mt-3 max-w-xl text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
                {slide.title}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/85">
                {slide.subtitle}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3 lg:max-w-2xl">
                {slide.benefits.map((item, i) => {
                  const Icon = benefitIcons[i] ?? Sparkles;
                  return (
                    <li
                      key={item.title}
                      className="flex items-start gap-2.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-md"
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0 text-white/90"
                      />
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {item.title}
                        </p>
                        <p className="mt-0.5 hidden text-[11px] leading-snug text-white/70 sm:block">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/hospitals"
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-white px-5 text-sm font-semibold text-beautiro-primary transition-colors hover:bg-white/95"
                >
                  {slide.ctaEvents}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/book"
                  className="inline-flex h-10 items-center rounded-lg border border-white/35 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/18"
                >
                  {slide.ctaBook}
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                <Gift size={12} />
                {slide.badge}
              </div>
              <h2 className="font-display mt-3 max-w-xl text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
                {slide.title}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/85">
                {slide.subtitle}
              </p>
              <p className="mt-2 text-xs text-white/65">{slide.note}</p>
              <Link
                href="/book"
                className="mt-5 inline-flex h-10 w-fit items-center gap-1.5 rounded-lg bg-white px-5 text-sm font-semibold text-beautiro-primary transition-colors hover:bg-white/95"
              >
                {slide.cta}
                <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-white/20 bg-[#0f172a]/40 text-white backdrop-blur-sm transition-colors hover:bg-[#0f172a]/60 sm:left-4"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-white/20 bg-[#0f172a]/40 text-white backdrop-blur-sm transition-colors hover:bg-[#0f172a]/60 sm:right-4"
              aria-label="Next slide"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === index
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
