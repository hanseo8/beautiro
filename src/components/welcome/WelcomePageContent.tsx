"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowRight,
  Building2,
  Gift,
  MessageCircle,
  Star,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TrackedWhatsAppLink } from "@/components/TrackedWhatsAppLink";
import { SOCIAL } from "@/lib/social";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import { trackPageView } from "@/lib/analytics";
import type { Locale } from "@/i18n/routing";
import {
  PROCEDURE_LANDING_SLUGS,
  type ProcedureLandingSlug,
} from "@/lib/procedure-landings";

export function WelcomePageContent() {
  const t = useTranslations("welcome");
  const locale = useLocale() as Locale;
  const wa = whatsappUrl(consultMessage({ locale }));

  useEffect(() => {
    trackPageView("welcome_landing");
  }, []);

  const procedures = PROCEDURE_LANDING_SLUGS.map((slug) => ({
    slug,
    label: t(`procedures.${slug}`),
  }));

  return (
    <div className="bg-gradient-to-b from-beautiro-surface to-white pb-16">
      <div className="container-babitalk py-8 sm:py-12">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-label text-beautiro-primary">{t("eyebrow")}</p>
          <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight text-beautiro-charcoal sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-beautiro-muted">
            {t("subtitle")}
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-lg gap-3">
          <TrackedWhatsAppLink
            href={wa}
            location="welcome_whatsapp"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-base font-semibold text-white shadow-md hover:bg-[#20BD5A]"
          >
            <MessageCircle size={20} />
            {t("ctaWhatsapp")}
          </TrackedWhatsAppLink>
          <Link
            href="/book"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-beautiro-primary text-base font-semibold text-white hover:bg-beautiro-primary-hover"
          >
            {t("ctaBook")}
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/hospitals"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-beautiro-border bg-white text-base font-semibold text-beautiro-charcoal hover:bg-beautiro-surface"
          >
            <Building2 size={18} className="text-beautiro-primary" />
            {t("ctaHospitals")}
          </Link>
          <Link
            href="/reviews"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-beautiro-primary/30 bg-beautiro-primary/5 text-base font-semibold text-beautiro-primary hover:bg-beautiro-primary/10"
          >
            <Gift size={18} />
            {t("ctaReview")}
          </Link>
        </div>

        <div className="card-modern mx-auto mt-8 max-w-lg p-5">
          <div className="flex items-center gap-2 text-beautiro-primary">
            <Star size={16} fill="currentColor" />
            <p className="text-sm font-semibold">{t("rewardTitle")}</p>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-beautiro-muted">
            {(t.raw("rewardItems") as string[]).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-10 max-w-lg">
          <p className="text-label text-beautiro-muted">{t("proceduresTitle")}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {procedures.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/procedures/${item.slug}`}
                  className="flex items-center justify-between rounded-xl border border-beautiro-border bg-white px-4 py-3 text-sm font-medium text-beautiro-charcoal hover:border-beautiro-primary/30 hover:text-beautiro-primary"
                >
                  {item.label}
                  <ArrowRight size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-10 max-w-lg text-center">
          <a
            href={SOCIAL.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-beautiro-primary hover:underline"
          >
            @{SOCIAL.instagram.handle}
            <ArrowRight size={14} />
          </a>
          <p className="mt-2 text-xs text-beautiro-muted">{t("instagramHint")}</p>
        </div>
      </div>
    </div>
  );
}
