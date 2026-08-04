"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { BannerPhotoImage } from "@/components/ui/BannerPhotoImage";
import { BANNER_FRAME_CLASS, heroBannerImages } from "@/lib/media";

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
  const banner = heroBannerImages[index] ?? heroBannerImages[0];

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  return (
    <section className="relative">
      <div className={`card-modern ${BANNER_FRAME_CLASS}`}>
        <BannerPhotoImage
          banner={banner}
          alt={slide.title}
          priority
        />
        <div className="absolute inset-0 bg-[#0f172a]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/35 to-transparent" />

        <div className="relative flex h-full flex-col justify-end px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-label text-white/75">{slide.subtitle}</p>
          <h2 className="font-display mt-2 max-w-xl text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
            {slide.title}
          </h2>
          <Link
            href={slide.href}
            className="mt-6 inline-flex h-11 w-fit items-center rounded-lg border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-beautiro-primary"
          >
            {slide.cta}
          </Link>
        </div>

        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-white/20 bg-[#0f172a]/30 text-white backdrop-blur-sm transition-colors hover:bg-[#0f172a]/50 sm:left-4"
          aria-label="Previous"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-white/20 bg-[#0f172a]/30 text-white backdrop-blur-sm transition-colors hover:bg-[#0f172a]/50 sm:right-4"
          aria-label="Next"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
        <div className="absolute bottom-4 right-4 z-10 flex gap-1.5 sm:bottom-6 sm:right-6">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all ${
                i === index
                  ? "w-5 bg-white"
                  : "w-1 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
