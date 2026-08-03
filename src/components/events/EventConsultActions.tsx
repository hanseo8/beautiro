"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
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
    consultMessage({ locale, procedureName, hospitalName }),
  );

  return (
    <div className="space-y-3">
      <WhatsAppButton href={wa} size="lg">
        {t("whatsappCta")}
      </WhatsAppButton>
      <Link
        href={`/book?procedure=${procedureId}`}
        className="flex h-12 w-full items-center justify-center rounded-xl border border-beautiro-border bg-white text-sm font-bold text-beautiro-charcoal hover:bg-beautiro-surface"
      >
        {t("bookCta")}
      </Link>
      <p className="text-center text-xs leading-relaxed text-beautiro-muted">
        {t("responseHint")}
      </p>
    </div>
  );
}
