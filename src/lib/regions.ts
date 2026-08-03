import type { MedicalCategory } from "@prisma/client";

export const PROVINCE_KEYS = ["incheon", "gyeonggi"] as const;
export const CITY_KEYS = ["ansan"] as const;
export const DISTRICT_KEYS = ["yeonsu", "namdong", "sangnok"] as const;
export const NEIGHBORHOOD_KEYS = ["guwol"] as const;
export const MEDICAL_CATEGORIES = [
  "PLASTIC",
  "DERMATOLOGY",
  "ORIENTAL",
  "DENTAL",
] as const satisfies readonly MedicalCategory[];

export type ProvinceKey = (typeof PROVINCE_KEYS)[number];
export type CityKey = (typeof CITY_KEYS)[number];
export type DistrictKey = (typeof DISTRICT_KEYS)[number];
export type NeighborhoodKey = (typeof NEIGHBORHOOD_KEYS)[number];

type RegionHospital = {
  provinceKey: string;
  cityKey: string | null;
  districtKey: string;
  neighborhoodKey?: string | null;
};

const PROVINCE_ORDER: Record<ProvinceKey, number> = {
  incheon: 0,
  gyeonggi: 1,
};

const DISTRICT_ORDER: Record<DistrictKey, number> = {
  namdong: 0,
  yeonsu: 1,
  sangnok: 2,
};

export function isProvinceKey(value: string): value is ProvinceKey {
  return (PROVINCE_KEYS as readonly string[]).includes(value);
}

export function isCityKey(value: string): value is CityKey {
  return (CITY_KEYS as readonly string[]).includes(value);
}

export function isDistrictKey(value: string): value is DistrictKey {
  return (DISTRICT_KEYS as readonly string[]).includes(value);
}

export function isNeighborhoodKey(value: string): value is NeighborhoodKey {
  return (NEIGHBORHOOD_KEYS as readonly string[]).includes(value);
}

export function formatRegionLabel(
  hospital: RegionHospital,
  t: (key: string) => string,
): string {
  const parts = [
    t(`regions.provinces.${hospital.provinceKey}`),
    hospital.cityKey ? t(`regions.cities.${hospital.cityKey}`) : null,
    t(`regions.districts.${hospital.districtKey}`),
    hospital.neighborhoodKey
      ? t(`regions.neighborhoods.${hospital.neighborhoodKey}`)
      : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function formatRegionSectionTitle(
  provinceKey: string,
  cityKey: string | null,
  districtKey: string,
  neighborhoodKey: string | null | undefined,
  t: (key: string) => string,
): string {
  return formatRegionLabel(
    { provinceKey, cityKey, districtKey, neighborhoodKey },
    t,
  );
}

export function regionGroupKey(hospital: RegionHospital): string {
  return `${hospital.provinceKey}:${hospital.cityKey ?? ""}:${hospital.districtKey}:${hospital.neighborhoodKey ?? ""}`;
}

export function compareRegionGroup(a: RegionHospital, b: RegionHospital): number {
  const pa =
    PROVINCE_ORDER[a.provinceKey as ProvinceKey] ??
    Number.MAX_SAFE_INTEGER;
  const pb =
    PROVINCE_ORDER[b.provinceKey as ProvinceKey] ??
    Number.MAX_SAFE_INTEGER;
  if (pa !== pb) return pa - pb;

  const cityA = a.cityKey ?? "";
  const cityB = b.cityKey ?? "";
  if (cityA !== cityB) return cityA.localeCompare(cityB);

  const da =
    DISTRICT_ORDER[a.districtKey as DistrictKey] ??
    Number.MAX_SAFE_INTEGER;
  const db =
    DISTRICT_ORDER[b.districtKey as DistrictKey] ??
    Number.MAX_SAFE_INTEGER;
  if (da !== db) return da - db;

  const na = a.neighborhoodKey ?? "";
  const nb = b.neighborhoodKey ?? "";
  return na.localeCompare(nb);
}

export function districtsForProvince(provinceKey: ProvinceKey): DistrictKey[] {
  if (provinceKey === "incheon") return ["namdong", "yeonsu"];
  return ["sangnok"];
}

export function citiesForProvince(provinceKey: ProvinceKey): CityKey[] {
  if (provinceKey === "gyeonggi") return ["ansan"];
  return [];
}
