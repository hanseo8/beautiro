"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { setLocaleCookie } from "@/lib/locale-cookie";

const localeOrder: Locale[] = ["en", "ko", "id"];

const localeCodes: Record<Locale, string> = {
  en: "EN",
  ko: "KO",
  id: "ID",
};

const localeNameKeys: Record<Locale, "nameEn" | "nameKo" | "nameId"> = {
  en: "nameEn",
  ko: "nameKo",
  id: "nameId",
};

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("localeSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function select(next: Locale) {
    setOpen(false);
    if (next !== locale) {
      setLocaleCookie(next);
      router.replace(pathname, { locale: next });
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-beautiro-border bg-white px-2.5 text-xs font-medium text-beautiro-charcoal transition-colors hover:bg-beautiro-surface sm:gap-2 sm:px-3"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("label")}
      >
        <Globe size={15} strokeWidth={1.5} className="text-beautiro-muted" />
        {!compact && (
          <span className="hidden text-beautiro-muted lg:inline">{t("label")}</span>
        )}
        <span className="font-semibold text-beautiro-primary">
          {compact ? localeCodes[locale] : t(localeNameKeys[locale])}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`text-beautiro-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("label")}
          className="absolute right-0 top-[calc(100%+0.375rem)] z-50 min-w-[11rem] overflow-hidden rounded-lg border border-beautiro-border bg-white py-1 shadow-lg shadow-[#0f172a]/8"
        >
          {localeOrder.map((loc) => {
            const selected = loc === locale;
            return (
              <li key={loc} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => select(loc)}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                    selected
                      ? "bg-beautiro-surface font-semibold text-beautiro-primary"
                      : "text-beautiro-charcoal hover:bg-beautiro-surface/70"
                  }`}
                >
                  <span>{t(localeNameKeys[loc])}</span>
                  {selected && (
                    <Check size={14} strokeWidth={2} className="shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
