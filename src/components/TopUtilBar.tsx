"use client";

import { useTranslations, useLocale } from "next-intl";
import { Headset, MessageCircle, Phone } from "lucide-react";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import { formatPhoneDisplay, phoneTelHref } from "@/lib/phone";
import type { Locale } from "@/i18n/routing";

export function TopUtilBar() {
  const t = useTranslations("utilBar");
  const locale = useLocale() as Locale;
  const wa = whatsappUrl(consultMessage({ locale }));
  const phone = formatPhoneDisplay();

  return (
    <div className="flex h-8 items-center border-b border-beautiro-border/60 bg-beautiro-primary-deep text-white">
      <div className="container-babitalk flex items-center justify-between gap-3">
        <p
          className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium sm:text-xs"
        >
          <Headset size={13} strokeWidth={1.5} className="shrink-0 opacity-80" />
          <span className="truncate">{t("tagline")}</span>
        </p>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <a
            href={phoneTelHref()}
            className="hidden items-center gap-1 text-[11px] font-medium text-white/90 transition-colors hover:text-white sm:flex sm:text-xs"
          >
            <Phone size={12} strokeWidth={1.5} className="hidden sm:block" />
            <span className="tabular-nums">{phone}</span>
          </a>
          <span className="hidden h-3 w-px bg-white/25 sm:block" aria-hidden />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-90 sm:text-xs"
            aria-label={t("whatsapp")}
          >
            <MessageCircle size={12} strokeWidth={1.5} />
            <span>{t("whatsapp")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
