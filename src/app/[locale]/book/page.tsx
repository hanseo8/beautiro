export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localizeHospital, publicHospitalWhere, prioritizeHospitals } from "@/lib/hospitals";
import type { Locale } from "@/i18n/routing";
import catalog from "@/lib/seranplus-catalog.json";
import { treatmentLabel } from "@/lib/treatment-labels";
import type { MedicalCategory } from "@prisma/client";
import { BookPageContent } from "@/components/book/BookPageContent";

type Props = { params: Promise<{ locale: string }> };

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHospitals = await getTranslations("hospitals");
  const loc = locale as Locale;

  const hospitals = prioritizeHospitals(await prisma.hospital.findMany({
    where: publicHospitalWhere,
    include: { procedures: true },
    orderBy: [{ featured: "desc" }, { nameKo: "asc" }],
  }));

  const regionT = (key: string) => tHospitals(key);
  const localizedHospitals = hospitals.map((h) =>
    localizeHospital(h, loc, regionT),
  );

  const existingProcedures = localizedHospitals.flatMap((item) =>
    item.procedures.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      hospitalName: item.name,
    })),
  );

  const tBook = await getTranslations("book");
  const commonProcedures = catalog.groups.flatMap(group => group.items.map(item => {
    const existing = existingProcedures.find(p => p.id === item.key || p.name === treatmentLabel(item, loc));
    return { id: existing?.id ?? `catalog:${item.key}`, name: treatmentLabel(item, loc), category: item.category as MedicalCategory, hospitalName: tBook("commonHospital"), requestedTreatmentKey: item.key, groupName: treatmentLabel(group, loc) };
  }));
  const sharedIds = new Set(commonProcedures.map(p => p.id));
  const procedures = [...commonProcedures, ...existingProcedures.filter(p => !sharedIds.has(p.id))];

  return (
    <Suspense fallback={<div className="container-babitalk py-10 text-sm text-beautiro-muted">…</div>}>
      <BookPageContent procedures={procedures} hospitals={localizedHospitals} />
    </Suspense>
  );
}
