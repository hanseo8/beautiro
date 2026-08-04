import type { MedicalCategory } from "@prisma/client";

export const PROCEDURE_LANDING_SLUGS = [
  "rhinoplasty",
  "double-eyelid",
  "botox-filler",
  "dental-implant",
  "skin-laser",
] as const;

export type ProcedureLandingSlug = (typeof PROCEDURE_LANDING_SLUGS)[number];

export type ProcedureLandingMeta = {
  category: MedicalCategory;
  searchQuery: string;
};

export const procedureLandingMeta: Record<
  ProcedureLandingSlug,
  ProcedureLandingMeta
> = {
  rhinoplasty: { category: "PLASTIC", searchQuery: "rhinoplasty" },
  "double-eyelid": { category: "PLASTIC", searchQuery: "eyelid" },
  "botox-filler": { category: "DERMATOLOGY", searchQuery: "botox" },
  "dental-implant": { category: "DENTAL", searchQuery: "implant" },
  "skin-laser": { category: "DERMATOLOGY", searchQuery: "laser" },
};

export function isProcedureLandingSlug(
  value: string,
): value is ProcedureLandingSlug {
  return (PROCEDURE_LANDING_SLUGS as readonly string[]).includes(value);
}
