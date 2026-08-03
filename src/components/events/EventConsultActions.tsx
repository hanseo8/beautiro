"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { eventInquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/routing";

export function EventConsultActions({
  procedureName,
  hospitalName,
}: {
  procedureName: string;
  hospitalName: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("event");

  const wa = whatsappUrl(
    eventInquiryMessage({ locale, procedureName, hospitalName }),
  );

  return (
    <div className="space-y-4 border-t border-beautiro-border pt-6">
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-beautiro-primary text-sm font-bold text-white transition-colors hover:bg-beautiro-primary-hover"
      >
        <MessageCircle size={18} />
        {t("whatsappCta")}
      </a>
      <p className="text-center text-xs leading-relaxed text-beautiro-muted">
        {t("responseHint")}
      </p>
      <Link
        href="/hospitals"
        className="flex items-center justify-center gap-1 text-xs font-semibold text-beautiro-primary hover:underline"
      >
        {t("moreHospitals")}
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}
