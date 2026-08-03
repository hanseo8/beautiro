export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localizeHospital } from "@/lib/hospitals";
import type { Locale } from "@/i18n/routing";
import { BookingWizard } from "@/components/BookingWizard";

type Props = { params: Promise<{ locale: string }> };

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("book");
  const tHospitals = await getTranslations("hospitals");
  const loc = locale as Locale;

  const hospitals = await prisma.hospital.findMany({
    include: { procedures: true },
  });

  const procedures = hospitals.flatMap((h) => {
    const item = localizeHospital(h, loc, (key) => tHospitals(key));
    return item.procedures.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      hospitalName: item.name,
    }));
  });

  return (
    <div className="bg-beautiro-surface py-10">
      <div className="container-babitalk">
        <h1 className="text-2xl font-bold tracking-tight text-beautiro-charcoal">{t("title")}</h1>
        <p className="mt-2 text-sm text-beautiro-muted">{t("asideHint")}</p>
        <div className="mt-8 rounded-2xl border border-beautiro-border bg-white p-6 sm:p-8">
          <Suspense fallback={<p className="text-sm text-beautiro-muted">…</p>}>
            <BookingWizard procedures={procedures} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
