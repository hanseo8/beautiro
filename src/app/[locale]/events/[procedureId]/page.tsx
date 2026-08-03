export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatKrw, localizeHospital } from "@/lib/hospitals";
import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";
import { EventConsultActions } from "@/components/events/EventConsultActions";
import { CoverImage } from "@/components/ui/CoverImage";
import { resolveHospitalImage } from "@/lib/media";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string; procedureId: string }>;
};

const categoryOverlay: Record<MedicalCategory, string> = {
  PLASTIC: "from-[#0f172a]/60 to-transparent",
  DERMATOLOGY: "from-[#0f172a]/55 to-transparent",
  ORIENTAL: "from-[#0f172a]/55 to-transparent",
  DENTAL: "from-[#0f172a]/55 to-transparent",
};

export default async function EventDetailPage({ params }: Props) {
  const { locale, procedureId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("event");
  const tCat = await getTranslations("hospitals.categories");
  const loc = locale as Locale;

  const procedure = await prisma.procedure.findUnique({
    where: { id: procedureId },
    include: { hospital: true },
  });

  if (!procedure) notFound();

  const hospital = localizeHospital(
    { ...procedure.hospital, procedures: [] },
    loc,
  );
  const procName =
    loc === "ko"
      ? procedure.nameKo
      : loc === "id"
        ? procedure.nameId
        : procedure.nameEn;

  const discount = 42;
  const price = procedure.priceFrom ?? 800000;
  const list = Math.round(price / (1 - discount / 100));
  const rating = 4.9;
  const reviews = 214;

  const includes = t.raw("includes") as string[];

  const coverImage = resolveHospitalImage(
    procedure.hospital.slug,
    procedure.category,
    procedure.hospital.coverImage,
  );

  return (
    <div className="bg-beautiro-surface pb-16">
      <div className="container-babitalk py-4">
        <nav className="text-xs text-beautiro-muted">
          <Link href="/" className="hover:text-beautiro-primary">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/hospitals" className="hover:text-beautiro-primary">
            {t("breadcrumbEvents")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-beautiro-charcoal">{procName}</span>
        </nav>
      </div>

      <div className="container-babitalk">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-sm">
              <CoverImage
                src={coverImage}
                alt={procName}
                priority
                sizes="(max-width: 1024px) 100vw, 720px"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${categoryOverlay[procedure.category]}`}
              />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="rounded bg-black/25 px-2 py-1 text-xs font-bold backdrop-blur-sm">
                  {tCat(procedure.category)}
                </span>
                <p className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  {procName}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-beautiro-border bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold">{t("aboutTitle")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-beautiro-muted">
                {hospital.description}
              </p>
              <ul className="mt-6 space-y-2 border-t border-beautiro-border pt-6">
                {includes.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2 text-sm text-beautiro-charcoal"
                  >
                    <BadgeCheck
                      size={18}
                      className="shrink-0 text-beautiro-primary"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-beautiro-border bg-white p-6">
              <h2 className="text-lg font-bold">{t("hospitalTitle")}</h2>
              <p className="mt-2 font-semibold">{hospital.name}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-beautiro-muted">
                <MapPin size={14} />
                {hospital.city}
                {hospital.district ? ` · ${hospital.district}` : ""}
              </p>
              <Link
                href="/hospitals"
                className="mt-4 inline-block text-sm font-semibold text-beautiro-primary hover:underline"
              >
                {t("moreHospitals")}
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-beautiro-border bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <p className="text-caption font-semibold text-beautiro-primary">
                {t("eventLabel")}
              </p>
              <h1 className="mt-2 text-xl font-bold leading-snug">
                {procName}
              </h1>
              <p className="mt-2 text-sm text-beautiro-muted">
                {hospital.name}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="font-bold">{rating}</span>
                <span className="text-beautiro-muted">
                  ({reviews} {t("reviews")})
                </span>
              </div>
              <div className="mt-6 border-t border-beautiro-border pt-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl text-price text-beautiro-primary">
                    {discount}%
                  </span>
                  <span className="text-2xl text-price">
                    {formatKrw(price, loc)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-beautiro-muted line-through">
                  {formatKrw(list, loc)}
                </p>
                <p className="mt-2 text-xs text-beautiro-muted">
                  {t("priceNote")}
                </p>
              </div>
              <div className="mt-6">
                <EventConsultActions
                  procedureId={procedure.id}
                  procedureName={procName}
                  hospitalName={hospital.name}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
