import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localizeHospital } from "@/lib/hospitals";
import { verifiedHospitalPhotos } from "@/lib/media";
import { CoverImage } from "@/components/ui/CoverImage";
import { SeranPlusTreatments } from "@/components/hospitals/SeranPlusTreatments";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";
export default async function SeranPlusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("seranplus");
  const regions = await getTranslations("hospitals");
  const event = await getTranslations("event");
  const hospital = await prisma.hospital.findUnique({ where: { slug: "seran-plus-plastic" }, include: { procedures: true } });
  if (!hospital) notFound();
  const localized = localizeHospital(hospital, locale as Locale, key => regions(key));
  const photos = verifiedHospitalPhotos[hospital.slug];
  return <div className="container-babitalk space-y-8 py-8 sm:py-12">
    <section className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-center">
      <div className="min-w-0">
        <p className="text-label text-beautiro-primary">Beautiro · Medical Concierge</p>
        <h1 className="mt-3 break-words text-2xl font-semibold sm:text-3xl">{localized.name}</h1>
        <p className="mt-3 flex items-start gap-2 text-sm text-beautiro-muted"><MapPin size={16} className="shrink-0" aria-hidden />{localized.regionLabel}</p>
        <p className="mt-4 text-sm leading-7 text-beautiro-muted">{t("profileIntro")}</p>
      </div>
      <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-xl"><CoverImage src={photos[0].src} alt={`${localized.name} — ${event("galleryLabels.lobby")}`} priority sizes="(max-width: 1024px) 100vw, 520px" /></div>
    </section>
    <SeranPlusTreatments procedures={localized.procedures} />
    <section aria-labelledby="seranplus-gallery-title">
      <h2 id="seranplus-gallery-title" className="text-lg font-semibold">{event("galleryTitle")}</h2>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">{photos.slice(1).map(photo => <figure key={photo.src} className="min-w-0"><div className="relative aspect-[4/3] overflow-hidden rounded-lg"><CoverImage src={photo.src} alt={`${localized.name} — ${event(`galleryLabels.${photo.label}`)}`} sizes="(max-width: 640px) 100vw, 520px" /></div><figcaption className="mt-2 text-xs text-beautiro-muted">{event(`galleryLabels.${photo.label}`)}</figcaption></figure>)}</div>
    </section>
  </div>;
}
