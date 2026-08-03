"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  id: "ID",
  en: "EN",
  ko: "KO",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-beautiro-muted">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={
            loc === locale
              ? "font-semibold text-beautiro-primary-deep"
              : "hover:text-beautiro-charcoal"
          }
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
