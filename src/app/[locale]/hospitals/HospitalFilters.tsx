"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  MEDICAL_CATEGORIES,
  PROVINCE_KEYS,
  citiesForProvince,
  districtsForProvince,
  isProvinceKey,
  type ProvinceKey,
} from "@/lib/regions";
import type { MedicalCategory } from "@prisma/client";

type FilterCounts = {
  total: number;
  byProvince: Record<string, number>;
  byDistrict: Record<string, number>;
  byCategory: Record<string, number>;
};

function buildHref(
  base: Record<string, string | undefined>,
  patch: Record<string, string | undefined>,
) {
  const next = { ...base, ...patch };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) {
    if (value) params.set(key, value);
  }
  const q = params.toString();
  return q ? `/hospitals?${q}` : "/hospitals";
}

function chipClass(active: boolean) {
  return active
    ? "border-beautiro-primary bg-beautiro-primary text-white"
    : "border-beautiro-border bg-white text-beautiro-charcoal hover:border-beautiro-primary/40 hover:bg-beautiro-surface";
}

export function HospitalFilters({ counts }: { counts: FilterCounts }) {
  const t = useTranslations("hospitals");
  const searchParams = useSearchParams();

  const current = {
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    province: searchParams.get("province") ?? undefined,
    district: searchParams.get("district") ?? undefined,
  };

  const province = isProvinceKey(current.province ?? "")
    ? (current.province as ProvinceKey)
    : undefined;

  const cities = province ? citiesForProvince(province) : [];
  const districts = province ? districtsForProvince(province) : [];

  return (
    <div className="mt-8 space-y-5 rounded-2xl border border-beautiro-border bg-beautiro-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-beautiro-charcoal">
          {t("filterTitle")}
        </p>
        <p className="text-xs text-beautiro-muted">
          {t("partnerCount", { count: counts.total })}
        </p>
      </div>

      <div>
        <p className="text-label text-beautiro-muted">{t("filterCategory")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href={buildHref(current, { category: undefined })}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${chipClass(!current.category)}`}
          >
            {t("filterAll")} ({counts.total})
          </Link>
          {MEDICAL_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={buildHref(current, { category: cat })}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${chipClass(current.category === cat)}`}
            >
              {t(`categories.${cat}`)} ({counts.byCategory[cat] ?? 0})
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="text-label text-beautiro-muted">{t("filterProvince")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href={buildHref(current, { province: undefined, district: undefined })}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${chipClass(!current.province)}`}
          >
            {t("filterAllRegions")} ({counts.total})
          </Link>
          {PROVINCE_KEYS.map((key) => (
            <Link
              key={key}
              href={buildHref(current, {
                province: key,
                district: undefined,
              })}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${chipClass(current.province === key)}`}
            >
              {t(`regions.provinces.${key}`)} ({counts.byProvince[key] ?? 0})
            </Link>
          ))}
        </div>
      </div>

      {province && (
        <div>
          <p className="text-label text-beautiro-muted">{t("filterDistrict")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={buildHref(current, { district: undefined })}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${chipClass(!current.district)}`}
            >
              {t("filterAllDistricts")} ({counts.byProvince[province] ?? 0})
            </Link>
            {cities.map((city) => (
              <span
                key={city}
                className="rounded-full border border-beautiro-border bg-white px-3 py-1 text-xs font-medium text-beautiro-muted"
              >
                {t(`regions.cities.${city}`)}
              </span>
            ))}
            {districts.map((key) => (
              <Link
                key={key}
                href={buildHref(current, { district: key })}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${chipClass(current.district === key)}`}
              >
                {t(`regions.districts.${key}`)} ({counts.byDistrict[key] ?? 0})
              </Link>
            ))}
          </div>
        </div>
      )}

      {(current.q || current.category || current.province || current.district) && (
        <Link
          href="/hospitals"
          className="inline-block text-xs font-semibold text-beautiro-primary hover:underline"
        >
          {t("clearFilters")}
        </Link>
      )}
    </div>
  );
}

export type { FilterCounts };
