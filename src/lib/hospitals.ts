import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";

type LocalizedHospital = {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  district: string | null;
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

export function localizeHospital(
  hospital: {
    id: string;
    slug: string;
    nameKo: string;
    nameEn: string;
    nameId: string;
    descriptionKo: string;
    descriptionEn: string;
    descriptionId: string;
    city: string;
    district: string | null;
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
  },
  locale: Locale,
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

  return {
    id: hospital.id,
    slug: hospital.slug,
    name,
    description,
    city: hospital.city,
    district: hospital.district,
    featured: hospital.featured,
    coverImage: hospital.coverImage,
    procedures: hospital.procedures.map((p) => ({
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
    })),
  };
}

export function formatKrw(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(
    locale === "ko" ? "ko-KR" : locale === "id" ? "id-ID" : "en-US",
    { style: "currency", currency: "KRW", maximumFractionDigits: 0 },
  ).format(amount);
}
