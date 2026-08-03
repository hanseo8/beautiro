export const dynamic = "force-dynamic";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localizeHospital } from "@/lib/hospitals";
import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";
import { HospitalList } from "./HospitalList";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function HospitalsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q, category } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("hospitals");
  const loc = locale as Locale;

  const hospitals = await prisma.hospital.findMany({
    include: { procedures: true },
    orderBy: [{ featured: "desc" }, { nameEn: "asc" }],
  });

  let items = hospitals.map((h) => localizeHospital(h, loc));

  const query = q?.trim().toLowerCase();
  if (query) {
    items = items.filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.description.toLowerCase().includes(query) ||
        h.procedures.some((p) => p.name.toLowerCase().includes(query)),
    );
  }

  const cat = category as MedicalCategory | undefined;
  if (cat && ["PLASTIC", "DERMATOLOGY", "ORIENTAL", "DENTAL"].includes(cat)) {
    items = items
      .map((h) => ({
        ...h,
        procedures: h.procedures.filter((p) => p.category === cat),
      }))
      .filter((h) => h.procedures.length > 0);
  }

  return (
    <div className="container-babitalk py-10">
      <h1 className="text-2xl font-bold tracking-tight text-beautiro-charcoal">{t("title")}</h1>
      <p className="mt-2 text-sm text-beautiro-muted">{t("subtitle")}</p>
      {(query || category) && (
        <p className="mt-4 rounded-xl bg-beautiro-accent-soft px-4 py-2 text-sm text-beautiro-primary-deep">
          {t("filterHint")}
          {query ? ` “${q}”` : ""}
          {category ? ` · ${t(`categories.${category as MedicalCategory}`)}` : ""}
        </p>
      )}
      <HospitalList items={items} locale={loc} />
    </div>
  );
}
