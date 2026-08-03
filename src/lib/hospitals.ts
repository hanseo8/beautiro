import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";
import { formatRegionLabel } from "@/lib/regions";

export type LocalizedHospital = {
  id: string;
  slug: string;
  name: string;
  description: string;
  provinceKey: string;
  cityKey: string | null;
  districtKey: string;
  neighborhoodKey: string | null;
  regionLabel: string;
  primaryCategory: MedicalCategory;
  categories: MedicalCategory[];
  featured: boolean;
  coverImage: string | null;
  procedures: {
    id: string;
    category: MedicalCategory;
    name: string;
    priceFrom: number | null;
    durationMin: number | null;
  }[];
};

type HospitalRecord = {
  id: string;
  slug: string;
  nameKo: string;
  nameEn: string;
  nameId: string;
  descriptionKo: string;
  descriptionEn: string;
  descriptionId: string;
  provinceKey: string;
  cityKey: string | null;
  districtKey: string;
  neighborhoodKey: string | null;
  primaryCategory: MedicalCategory;
  featured: boolean;
  coverImage: string | null;
  procedures: {
    id: string;
    category: MedicalCategory;
    nameKo: string;
    nameEn: string;
    nameId: string;
    priceFrom: number | null;
    durationMin: number | null;
  }[];
};

export function localizeHospital(
  hospital: HospitalRecord,
  locale: Locale,
  regionT: (key: string) => string,
): LocalizedHospital {
  const name =
    locale === "ko"
      ? hospital.nameKo
      : locale === "id"
        ? hospital.nameId
        : hospital.nameEn;
  const description =
    locale === "ko"
      ? hospital.descriptionKo
      : locale === "id"
        ? hospital.descriptionId
        : hospital.descriptionEn;

  const procedures = hospital.procedures.map((p) => ({
    id: p.id,
    category: p.category,
    name:
      locale === "ko"
        ? p.nameKo
        : locale === "id"
          ? p.nameId
          : p.nameEn,
    priceFrom: p.priceFrom,
    durationMin: p.durationMin,
  }));

  const categories = [
    ...new Set(procedures.map((p) => p.category)),
  ] as MedicalCategory[];

  return {
    id: hospital.id,
    slug: hospital.slug,
    name,
    description,
    provinceKey: hospital.provinceKey,
    cityKey: hospital.cityKey,
    districtKey: hospital.districtKey,
    neighborhoodKey: hospital.neighborhoodKey,
    regionLabel: formatRegionLabel(hospital, regionT),
    primaryCategory: hospital.primaryCategory,
    categories,
    featured: hospital.featured,
    coverImage: hospital.coverImage,
    procedures,
  };
}

export function formatKrw(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(
    locale === "ko" ? "ko-KR" : locale === "id" ? "id-ID" : "en-US",
    { style: "currency", currency: "KRW", maximumFractionDigits: 0 },
  ).format(amount);
}
