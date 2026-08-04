export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localizeHospital } from "@/lib/hospitals";
import type { Locale } from "@/i18n/routing";
import { BookPageContent } from "@/components/book/BookPageContent";

type Props = { params: Promise<{ locale: string }> };

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHospitals = await getTranslations("hospitals");
  const loc = locale as Locale;

  const hospitals = await prisma.hospital.findMany({
    include: { procedures: true },
    orderBy: [{ featured: "desc" }, { nameKo: "asc" }],
  });

  const regionT = (key: string) => tHospitals(key);
  const localizedHospitals = hospitals.map((h) =>
    localizeHospital(h, loc, regionT),
  );

  const procedures = localizedHospitals.flatMap((item) =>
    item.procedures.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      hospitalName: item.name,
    })),
  );

  return (
    <Suspense fallback={<div className="container-babitalk py-10 text-sm text-beautiro-muted">…</div>}>
      <BookPageContent procedures={procedures} hospitals={localizedHospitals} />
    </Suspense>
  );
}
