import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TrackedWhatsAppLink } from "@/components/TrackedWhatsAppLink";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import {
  isProcedureLandingSlug,
  procedureLandingMeta,
  PROCEDURE_LANDING_SLUGS,
  type ProcedureLandingSlug,
} from "@/lib/procedure-landings";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return PROCEDURE_LANDING_SLUGS.flatMap((slug) =>
    ["en", "ko", "id"].map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isProcedureLandingSlug(slug)) return {};
  const t = await getTranslations({
    locale,
    namespace: `procedureLandings.${slug}`,
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ProcedureLandingPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isProcedureLandingSlug(slug)) notFound();

  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations(`procedureLandings.${slug}`);
  const tCommon = await getTranslations("procedureLandings.common");
  const meta = procedureLandingMeta[slug as ProcedureLandingSlug];
  const wa = whatsappUrl(
    consultMessage({
      locale: loc,
      extra: t("whatsappMessage"),
    }),
  );

  const benefits = t.raw("benefits") as string[];
  const includes = t.raw("includes") as string[];

  return (
    <div className="bg-gradient-to-b from-beautiro-surface/50 to-white pb-16">
      <div className="container-babitalk py-10">
        <nav className="mb-6 text-xs font-medium text-beautiro-muted">
          <Link href="/" className="hover:text-beautiro-primary">
            {tCommon("breadcrumbHome")}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/hospitals" className="hover:text-beautiro-primary">
            {tCommon("breadcrumbProcedures")}
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <article>
            <p className="text-label text-beautiro-primary">{t("badge")}</p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-beautiro-charcoal">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-beautiro-muted">
              {t("subtitle")}
            </p>

            <div className="card-modern mt-8 p-6">
              <p className="text-label text-beautiro-muted">{tCommon("priceLabel")}</p>
              <p className="mt-1 text-2xl font-bold text-beautiro-charcoal">
                {t("priceFrom")}
              </p>
              <p className="mt-2 text-xs text-beautiro-muted">{tCommon("priceNote")}</p>
            </div>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-beautiro-charcoal">
                {tCommon("benefitsTitle")}
              </h2>
              <ul className="mt-4 space-y-3">
                {benefits.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-beautiro-muted"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-beautiro-primary"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-beautiro-charcoal">
                {tCommon("includesTitle")}
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {includes.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-beautiro-surface px-4 py-3 text-sm text-beautiro-charcoal"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="h-fit space-y-4 lg:sticky lg:top-28">
            <div className="card-modern p-5">
              <p className="text-sm font-semibold text-beautiro-charcoal">
                {tCommon("ctaTitle")}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-beautiro-muted">
                {tCommon("ctaDesc")}
              </p>
              <TrackedWhatsAppLink
                href={wa}
                location={`procedure_${slug}`}
                className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#25D366] text-sm font-semibold text-white hover:bg-[#20BD5A]"
              >
                {tCommon("whatsappCta")}
              </TrackedWhatsAppLink>
              <Link
                href="/book"
                className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-beautiro-primary text-sm font-semibold text-white hover:bg-beautiro-primary-hover"
              >
                {tCommon("bookCta")}
              </Link>
              <Link
                href={`/hospitals?category=${meta.category}&q=${encodeURIComponent(meta.searchQuery)}`}
                className="mt-2 flex h-11 w-full items-center justify-center gap-1 rounded-xl border border-beautiro-border text-sm font-semibold text-beautiro-charcoal hover:bg-beautiro-surface"
              >
                <MapPin size={14} />
                {tCommon("hospitalsCta")}
              </Link>
            </div>
            <Link
              href="/reviews"
              className="card-modern flex items-center justify-between p-5 text-sm font-semibold text-beautiro-primary hover:bg-beautiro-primary/5"
            >
              {tCommon("reviewReward")}
              <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
