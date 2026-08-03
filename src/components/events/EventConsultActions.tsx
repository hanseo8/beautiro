"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MessageCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
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
    <div className="space-y-3">
      <WhatsAppButton href={wa} size="lg">
        <span className="inline-flex items-center gap-2">
          <MessageCircle size={18} />
          {t("whatsappCta")}
        </span>
      </WhatsAppButton>
      <p className="text-center text-xs leading-relaxed text-beautiro-muted">
        {t("responseHint")}
      </p>
      <Link
        href="/hospitals"
        className="block text-center text-xs font-semibold text-beautiro-primary hover:underline"
      >
        {t("moreHospitals")}
      </Link>
    </div>
  );
}
