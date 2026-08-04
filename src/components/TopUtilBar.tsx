"use client";

import { useTranslations, useLocale } from "next-intl";
import { Headset, MessageCircle, Phone } from "lucide-react";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import { formatPhoneDisplay, phoneTelHref } from "@/lib/phone";
import type { Locale } from "@/i18n/routing";

export function TopUtilBar({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("utilBar");
  const locale = useLocale() as Locale;
  const wa = whatsappUrl(consultMessage({ locale }));
  const phone = formatPhoneDisplay();

  return (
    <div
      className={`border-b border-beautiro-border/60 bg-beautiro-primary-deep text-white transition-all duration-200 ${
        compact ? "py-1" : "py-1.5"
      }`}
    >
      <div className="container-babitalk flex items-center justify-between gap-3">
        <p
          className={`flex min-w-0 items-center gap-1.5 font-medium transition-all duration-200 ${
            compact ? "text-[10px]" : "text-[11px] sm:text-xs"
          }`}
        >
          <Headset size={13} strokeWidth={1.5} className="shrink-0 opacity-80" />
          <span className="truncate">{t("tagline")}</span>
        </p>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <a
            href={phoneTelHref()}
            className={`flex items-center gap-1 font-medium text-white/90 transition-colors hover:text-white ${
              compact ? "text-[10px]" : "text-[11px] sm:text-xs"
            }`}
          >
            <Phone size={12} strokeWidth={1.5} className="hidden sm:block" />
            <span className="tabular-nums">{phone}</span>
          </a>
          <span className="h-3 w-px bg-white/25" aria-hidden />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 font-semibold text-white transition-opacity hover:opacity-90 ${
              compact ? "text-[10px]" : "text-[11px] sm:text-xs"
            }`}
          >
            <MessageCircle size={12} strokeWidth={1.5} />
            <span>{t("whatsapp")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
