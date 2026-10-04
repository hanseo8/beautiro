"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { eventInquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/routing";

export function EventConsultActions({
  procedureId,
  procedureName,
  hospitalName,
}: {
  procedureId: string;
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
      <Link
        href={`/book?tab=bookings&procedure=${encodeURIComponent(procedureId)}`}
        className="flex min-h-12 w-full items-center justify-center rounded-lg border border-beautiro-primary px-4 py-3 text-center text-sm font-semibold text-beautiro-primary hover:bg-beautiro-primary/5"
      >
        {t("bookOnline")}
      </Link>
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
