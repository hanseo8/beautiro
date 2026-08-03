export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Sparkles } from "lucide-react";
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
    <div className="min-h-[70vh] bg-[linear-gradient(180deg,var(--beautiro-surface)_0%,#fff_40%)] pb-20 pt-6">
      <div className="container-babitalk max-w-lg">
        <nav className="mb-6 text-xs font-medium text-beautiro-muted">
          <Link href="/" className="hover:text-beautiro-primary">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/hospitals" className="hover:text-beautiro-primary">
            {t("breadcrumbEvents")}
          </Link>
        </nav>

        <article className="card-modern overflow-hidden">
          <div className="relative aspect-[4/3]">
            <CoverImage
              src={coverImage}
              alt={hospital.name}
              priority
              sizes="(max-width: 512px) 100vw, 512px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent" />
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-beautiro-primary/10 px-3 py-1.5 text-xs font-bold text-beautiro-primary">
              <Sparkles size={14} />
              {t("discountBadge")}
            </div>

            <div>
              <p className="text-label text-beautiro-muted">
                {tCat(procedure.category)}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-beautiro-charcoal sm:text-3xl">
                {hospital.name}
              </h1>
              <p className="mt-2 text-base text-beautiro-muted">{procName}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-beautiro-muted">
                <MapPin size={15} className="text-beautiro-primary" />
                {hospital.regionLabel}
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-beautiro-surface p-5">
              <p className="text-sm font-medium leading-relaxed text-beautiro-charcoal">
                {t("summary")}
              </p>
              <p className="text-sm leading-relaxed text-beautiro-muted">
                {t("inquiryNote")}
              </p>
            </div>

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
