export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localizeHospital } from "@/lib/hospitals";
import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";
import {
  isDistrictKey,
  isProvinceKey,
  MEDICAL_CATEGORIES,
} from "@/lib/regions";
import { HospitalList } from "./HospitalList";
import { HospitalSearchPanel } from "./HospitalSearchPanel";
import type { FilterCounts } from "./types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    province?: string;
    district?: string;
  }>;
};

function buildCounts(
  items: ReturnType<typeof localizeHospital>[],
): FilterCounts {
  const byProvince: Record<string, number> = {};
  const byDistrict: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const h of items) {
    byProvince[h.provinceKey] = (byProvince[h.provinceKey] ?? 0) + 1;
    byDistrict[h.districtKey] = (byDistrict[h.districtKey] ?? 0) + 1;
    for (const cat of h.categories) {
      byCategory[cat] = (byCategory[cat] ?? 0) + 1;
    }
  }

  return {
    total: items.length,
    byProvince,
    byDistrict,
    byCategory,
  };
}

export default async function HospitalsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q, category, province, district } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("hospitals");
  const loc = locale as Locale;
  const regionT = (key: string) => t(key);

  const hospitals = await prisma.hospital.findMany({
    include: { procedures: true },
    orderBy: [
      { provinceKey: "asc" },
      { cityKey: "asc" },
      { districtKey: "asc" },
      { primaryCategory: "asc" },
      { nameKo: "asc" },
    ],
  });

  const allItems = hospitals.map((h) => localizeHospital(h, loc, regionT));
  const counts = buildCounts(allItems);

  let items = allItems;

  const query = q?.trim().toLowerCase();
  if (query) {
    items = items.filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.description.toLowerCase().includes(query) ||
        h.regionLabel.toLowerCase().includes(query) ||
        h.procedures.some((p) => p.name.toLowerCase().includes(query)),
    );
  }

  const cat = category as MedicalCategory | undefined;
  if (cat && MEDICAL_CATEGORIES.includes(cat)) {
    items = items.filter(
      (h) =>
        h.primaryCategory === cat ||
        h.procedures.some((p) => p.category === cat),
    );
  }

  if (province && isProvinceKey(province)) {
    items = items.filter((h) => h.provinceKey === province);
  }

  if (district && isDistrictKey(district)) {
    items = items.filter((h) => h.districtKey === district);
  }

  return (
    <div className="container-babitalk py-10">
      <h1 className="text-2xl font-bold tracking-tight text-beautiro-charcoal">
        {t("title")}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-beautiro-muted">
        {t("subtitle")}
      </p>

      <Suspense fallback={null}>
        <HospitalSearchPanel counts={counts}>
          {items.length !== allItems.length && (
            <p className="mb-4 text-sm text-beautiro-muted">
              {t("resultCount", { count: items.length })}
            </p>
          )}
          <HospitalList items={items} locale={loc} />
        </HospitalSearchPanel>
      </Suspense>
    </div>
  );
}
