"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  Car,
  ChevronLeft,
  ChevronRight,
  Gift,
  MapPin,
  MessageSquareHeart,
  Plane,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BannerPhotoImage } from "@/components/ui/BannerPhotoImage";
import { PROMO_BANNER_FRAME_CLASS, promoBannerImages } from "@/lib/media";

export type PromoSlide =
  | {
      type: "brandKey";
      badge: string;
      title: string;
      ctaBook: string;
      ctaServices: string;
    }
  | {
      type: "openPromo" | "reviewPromo";
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

const navBtnClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-beautiro-border bg-white/95 text-beautiro-charcoal shadow-sm backdrop-blur-sm transition-colors hover:bg-white";

function PromoBadge({
  icon: Icon,
  children,
}: {
  icon: typeof Sparkles;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-beautiro-border bg-white px-3 py-1 text-[11px] font-bold tracking-wide text-beautiro-charcoal shadow-sm">
      <Icon size={12} className="text-beautiro-primary" />
      {children}
    </div>
  );
}

function SlideContent({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center text-center ${
        wide ? "w-full max-w-3xl" : "w-full max-w-xl sm:max-w-2xl"
      }`}
    >
      {children}
    </div>
  );
}

export function PromoBannerCarousel({ slides }: { slides: PromoSlide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];
  const banner = promoBannerImages[index] ?? promoBannerImages[0];
  const isDenseSlide =
    slide.type === "openPromo" ||
    slide.type === "reviewPromo" ||
    slide.type === "cosmetics";

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

  const benefitIcons =
    slide.type === "reviewPromo"
      ? [Sparkles, Car]
      : slide.type === "openPromo"
        ? [Wallet, Plane, Building2]
        : [Sparkles];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-beautiro-border bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
      <div
        className={`${PROMO_BANNER_FRAME_CLASS} ${
          isDenseSlide ? "min-h-[260px] sm:min-h-[200px]" : ""
        }`}
      >
        <div className="absolute inset-0">
          <BannerPhotoImage banner={banner} alt={slide.title} priority />
          <div className="absolute inset-0 bg-white/78" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.88)_45%,rgba(255,255,255,0.55)_100%)]" />
        </div>

        <div className="relative z-10 grid min-h-[inherit] w-full place-items-center px-11 py-5 pb-8 sm:absolute sm:inset-0 sm:px-16 sm:py-5 sm:pb-8">
          {slide.type === "brandKey" ? (
            <SlideContent>
              <PromoBadge icon={MapPin}>{slide.badge}</PromoBadge>
              <div className="mt-3 w-full rounded-2xl border border-beautiro-border/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-5 sm:py-3.5">
                <h2 className="text-[15px] font-bold leading-snug tracking-tight text-beautiro-charcoal sm:text-xl sm:leading-snug">
                  {slide.title}
                </h2>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Link
                  href="/book"
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-beautiro-primary px-4 text-xs font-bold text-white transition-colors hover:bg-beautiro-primary-hover sm:h-10 sm:px-5 sm:text-sm"
                >
                  {slide.ctaBook}
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/#services"
                  className="inline-flex h-9 items-center rounded-full border border-beautiro-border bg-white px-4 text-xs font-semibold text-beautiro-charcoal transition-colors hover:border-beautiro-primary/30 hover:text-beautiro-primary sm:h-10 sm:px-5 sm:text-sm"
                >
                  {slide.ctaServices}
                </Link>
              </div>
            </SlideContent>
          ) : slide.type === "openPromo" || slide.type === "reviewPromo" ? (
            <SlideContent wide>
              <PromoBadge
                icon={slide.type === "reviewPromo" ? MessageSquareHeart : Sparkles}
              >
                {slide.badge}
              </PromoBadge>
              <h2 className="mt-2 text-[15px] font-bold leading-snug tracking-tight text-beautiro-charcoal sm:text-xl">
                {slide.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-beautiro-muted sm:text-sm">
                {slide.subtitle}
              </p>
              <ul
                className={`mt-2.5 grid w-full gap-1.5 ${
                  slide.benefits.length <= 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-3"
                }`}
              >
                {slide.benefits.map((item, i) => {
                  const Icon = benefitIcons[i] ?? Sparkles;
                  return (
                    <li
                      key={item.title}
                      className="flex items-center gap-2 rounded-xl border border-beautiro-border bg-white/95 px-2.5 py-2 text-left shadow-sm backdrop-blur-sm"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-beautiro-surface text-beautiro-primary">
                        <Icon size={14} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold leading-snug text-beautiro-charcoal sm:text-xs">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-snug text-beautiro-muted sm:text-[11px]">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Link
                  href={slide.type === "reviewPromo" ? "/reviews" : "/hospitals"}
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-beautiro-charcoal px-4 text-xs font-bold text-white transition-colors hover:bg-beautiro-charcoal-hover sm:h-10 sm:px-5 sm:text-sm"
                >
                  {slide.ctaEvents}
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/book"
                  className="inline-flex h-9 items-center rounded-full border border-beautiro-border bg-white px-4 text-xs font-semibold text-beautiro-charcoal transition-colors hover:border-beautiro-primary/30 hover:text-beautiro-primary sm:h-10 sm:px-5 sm:text-sm"
                >
                  {slide.ctaBook}
                </Link>
              </div>
            </SlideContent>
          ) : slide.type === "cosmetics" ? (
            <SlideContent>
              <PromoBadge icon={Gift}>{slide.badge}</PromoBadge>
              <h2 className="mt-2 text-[15px] font-bold leading-snug tracking-tight text-beautiro-charcoal sm:text-xl">
                {slide.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-beautiro-muted sm:text-sm">
                {slide.subtitle}
              </p>
              <p className="mt-1 text-[11px] text-beautiro-muted-light">{slide.note}</p>
              <Link
                href="/book"
                className="mt-3 inline-flex h-9 items-center gap-1 rounded-full bg-beautiro-primary px-4 text-xs font-bold text-white transition-colors hover:bg-beautiro-primary-hover sm:h-10 sm:px-5 sm:text-sm"
              >
                {slide.cta}
                <ArrowRight size={14} />
              </Link>
            </SlideContent>
          ) : null}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className={`absolute left-2 top-1/2 z-20 -translate-y-1/2 sm:left-3 ${navBtnClass}`}
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={next}
              className={`absolute right-2 top-1/2 z-20 -translate-y-1/2 sm:right-3 ${navBtnClass}`}
              aria-label="Next slide"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
            <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === index
                      ? "w-5 bg-beautiro-primary"
                      : "w-1.5 bg-beautiro-border hover:bg-beautiro-muted-light"
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
