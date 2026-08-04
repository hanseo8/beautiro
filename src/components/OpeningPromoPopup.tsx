"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Car, Sparkles, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

const STORAGE_KEY = "beautiro-opening-promo-dismissed";
const PROMO_IMAGE = "/promo/jakarta-launch-popup.png";

function isDismissedToday() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEY) === new Date().toDateString();
}

function lockBodyScroll() {
  const scrollY = window.scrollY;
  document.documentElement.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
  return scrollY;
}

function unlockBodyScroll(scrollY: number) {
  document.documentElement.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  window.scrollTo(0, scrollY);
}

const CONSULTATION_HREF = "/book?tab=account";

export function OpeningPromoPopup() {
  const t = useTranslations("promoPopup");
  const router = useRouter();
  const benefits = t.raw("benefits") as { title: string; desc: string }[];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isDismissedToday()) return;
    const timer = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const scrollY = lockBodyScroll();
    return () => unlockBodyScroll(scrollY);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
  }

  function dismissToday() {
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
    setOpen(false);
  }

  function goToConsultation() {
    setOpen(false);
    router.push(CONSULTATION_HREF);
  }

  if (!open) return null;

  const benefitIcons = [Sparkles, Car];

  return (
    <div
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain pointer-events-none"
      role="presentation"
    >
      <button
        type="button"
        className="pointer-events-auto fixed inset-0 z-0 bg-[#0f172a]/50 backdrop-blur-[2px]"
        aria-label={t("close")}
        onClick={close}
      />

      <div className="pointer-events-none relative z-10 flex min-h-full items-start justify-center px-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:items-center sm:px-4 sm:py-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="opening-promo-title"
          className="pointer-events-auto relative w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={close}
            className="absolute -top-2 right-0 z-30 flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full bg-[#0f172a] px-3 text-white shadow-[0_8px_24px_rgba(15,23,42,0.35)] ring-2 ring-white sm:-right-2 sm:-top-2 sm:h-10 sm:min-w-10 sm:px-0"
            aria-label={t("close")}
          >
            <X size={20} strokeWidth={2} />
            <span className="pr-0.5 text-xs font-bold sm:sr-only">{t("close")}</span>
          </button>

          <div className="max-h-[calc(100dvh-5.5rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] overflow-y-auto overscroll-contain rounded-2xl border border-beautiro-border bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)] sm:max-h-[min(90dvh,760px)]">
            <div className="relative aspect-[16/10] w-full shrink-0 bg-beautiro-surface">
              <Image
                src={PROMO_IMAGE}
                alt={t("imageAlt")}
                fill
                priority
                sizes="(max-width: 640px) 92vw, 512px"
                className="object-cover object-center"
              />
            </div>

            <div className="bg-gradient-to-br from-beautiro-primary/10 via-white to-beautiro-surface px-5 pb-5 pt-5 sm:px-7 sm:pb-6">
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

              <button
                type="button"
                onClick={goToConsultation}
                className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-beautiro-primary text-sm font-bold text-white transition-colors hover:bg-beautiro-primary-hover"
              >
                {t("ctaBook")}
              </button>

              <button
                type="button"
                onClick={dismissToday}
                className="mt-3 w-full rounded-lg py-2 text-center text-xs font-medium text-beautiro-muted transition-colors hover:bg-beautiro-surface hover:text-beautiro-primary"
              >
                {t("dismissToday")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
