export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Percent } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localizeHospital } from "@/lib/hospitals";
import type { Locale } from "@/i18n/routing";
import { EventConsultActions } from "@/components/events/EventConsultActions";
import { CoverImage } from "@/components/ui/CoverImage";
import { resolveHospitalImage } from "@/lib/media";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string; procedureId: string }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { locale, procedureId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("event");
  const tCat = await getTranslations("hospitals.categories");
  const tHospitals = await getTranslations("hospitals");
  const loc = locale as Locale;

  const procedure = await prisma.procedure.findUnique({
    where: { id: procedureId },
    include: { hospital: true },
  });

  if (!procedure) notFound();

  const hospital = localizeHospital(
    { ...procedure.hospital, procedures: [] },
    loc,
    (key) => tHospitals(key),
  );
  const procName =
    loc === "ko"
      ? procedure.nameKo
      : loc === "id"
        ? procedure.nameId
        : procedure.nameEn;

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
        </nav>
      </div>

      <div className="container-babitalk max-w-2xl">
        <article className="overflow-hidden rounded-2xl border border-beautiro-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="relative aspect-[16/9]">
            <CoverImage
              src={coverImage}
              alt={hospital.name}
              priority
              sizes="(max-width: 672px) 100vw, 672px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-beautiro-primary px-2.5 py-1 text-xs font-bold">
                <Percent size={14} />
                {t("discountBadge")}
              </span>
              <h1 className="mt-3 text-2xl font-bold leading-snug tracking-tight">
                {hospital.name}
              </h1>
              <p className="mt-1 text-sm text-white/90">{procName}</p>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg bg-beautiro-surface px-2.5 py-1 text-xs font-semibold text-beautiro-primary">
                {tCat(procedure.category)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-beautiro-surface px-2.5 py-1 text-xs font-medium text-beautiro-muted">
                <MapPin size={12} />
                {hospital.regionLabel}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-beautiro-charcoal">
              {t("summary")}
            </p>
            <p className="text-sm leading-relaxed text-beautiro-muted">
              {t("inquiryNote")}
            </p>

            <EventConsultActions
              procedureName={procName}
              hospitalName={hospital.name}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
