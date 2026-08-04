"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Car, Sparkles, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "beautiro-opening-promo-dismissed";
const PROMO_IMAGE = "/promo/jakarta-launch-popup.png";

function isDismissedToday() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEY) === new Date().toDateString();
}

export function OpeningPromoPopup() {
  const t = useTranslations("promoPopup");
  const benefits = t.raw("benefits") as { title: string; desc: string }[];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isDismissedToday()) return;
    const timer = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function dismissToday() {
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
    setOpen(false);
  }

  if (!open) return null;

  const benefitIcons = [Sparkles, Car];

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[80] bg-[#0f172a]/45 backdrop-blur-[2px]"
        aria-label={t("close")}
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="opening-promo-title"
        className="fixed inset-0 z-[81] flex items-center justify-center p-4 sm:p-6"
      >
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-beautiro-border bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
          <div className="relative aspect-[16/10] w-full bg-beautiro-surface">
            <Image
              src={PROMO_IMAGE}
              alt={t("imageAlt")}
              fill
              priority
              sizes="(max-width: 640px) 92vw, 512px"
              className="object-cover object-center"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/95 text-beautiro-charcoal shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
              aria-label={t("close")}
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="bg-gradient-to-br from-beautiro-primary/10 via-white to-beautiro-surface px-6 pb-5 pt-5 sm:px-7 sm:pb-6">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-beautiro-primary/20 bg-white px-3 py-1 text-[11px] font-bold tracking-wide text-beautiro-primary">
              <Sparkles size={12} />
              {t("badge")}
            </p>
            <h2
              id="opening-promo-title"
              className="mt-3 text-lg font-bold leading-snug tracking-tight text-beautiro-charcoal sm:text-xl"
            >
              {t("title")}
            </h2>
            <p className="mt-2 text-sm font-semibold text-beautiro-primary">
              {t("openingNote")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-beautiro-muted">
              {t("body")}
            </p>

            <ul className="mt-4 space-y-2">
              {benefits.map((item, index) => {
                const Icon = benefitIcons[index] ?? Sparkles;
                return (
                  <li
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-beautiro-border bg-white/90 px-3 py-2.5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-beautiro-surface text-beautiro-primary">
                      <Icon size={16} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-beautiro-charcoal">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-beautiro-muted">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-3 text-[11px] leading-relaxed text-beautiro-muted-light">
              {t("note")}
            </p>

            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-beautiro-primary text-sm font-bold text-white transition-colors hover:bg-beautiro-primary-hover"
            >
              {t("ctaBook")}
            </Link>

            <button
              type="button"
              onClick={dismissToday}
              className="mt-3 w-full py-1 text-center text-xs font-medium text-beautiro-muted transition-colors hover:text-beautiro-primary"
            >
              {t("dismissToday")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
