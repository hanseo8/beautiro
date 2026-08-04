export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Headset, Shield } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localizeHospital } from "@/lib/hospitals";
import type { Locale } from "@/i18n/routing";
import { BookingWizard } from "@/components/BookingWizard";
import { BookingBenefitsStrip } from "@/components/home/BookingBenefitsStrip";

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
    <div className="bg-gradient-to-b from-beautiro-surface to-white pb-16 pt-8 sm:pt-10">
      <div className="container-babitalk">
        <div className="mx-auto max-w-3xl text-center lg:max-w-none lg:text-left">
          <p className="text-label text-beautiro-primary">{t("eyebrow")}</p>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-beautiro-charcoal sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-beautiro-muted">
            {t("asideHint")}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 lg:justify-start">
            <span className="inline-flex items-center gap-1.5 text-xs text-beautiro-muted">
              <Headset size={14} className="text-beautiro-primary" />
              {t("trustResponse")}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-beautiro-muted">
              <Shield size={14} className="text-beautiro-primary" />
              {t("trustPrivate")}
            </span>
          </div>
        </div>

        <BookingBenefitsStrip />

        <div className="card-modern mx-auto mt-6 max-w-4xl p-5 sm:mt-8 sm:p-8">
          <Suspense fallback={<p className="text-sm text-beautiro-muted">…</p>}>
            <BookingWizard procedures={procedures} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
