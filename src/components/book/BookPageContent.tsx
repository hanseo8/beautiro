"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Headset, Shield } from "lucide-react";
import { BookingWizard, type ProcedureOption } from "@/components/BookingWizard";
import { BookingsHub } from "@/components/book/BookingsHub";
import type { LocalizedHospital } from "@/lib/hospitals";
import { BookingBenefitsStrip } from "@/components/home/BookingBenefitsStrip";
import { PartnerHospitalsPreview } from "@/components/book/PartnerHospitalsPreview";

export function BookPageContent({
  procedures,
  hospitals,
}: {
  procedures: ProcedureOption[];
  hospitals: LocalizedHospital[];
}) {
  const t = useTranslations("book");
  const tab = useSearchParams().get("tab");
  const isBookingsTab = tab === "bookings" || tab === "history";

  return (
    <div className="bg-gradient-to-b from-beautiro-surface to-white pb-16 pt-8 sm:pt-10">
      <div className="container-babitalk">
        {!isBookingsTab && (
          <>
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
            <PartnerHospitalsPreview hospitals={hospitals} />
          </>
        )}

        <div
          className={`card-modern mx-auto p-5 sm:p-8 ${
            isBookingsTab ? "mt-0 max-w-2xl" : "mt-6 max-w-4xl sm:mt-8"
          }`}
        >
          <Suspense fallback={<p className="text-sm text-beautiro-muted">…</p>}>
            {isBookingsTab ? (
              <BookingsHub
                procedures={procedures}
                defaultView={tab === "history" ? "history" : "new"}
              />
            ) : (
              <BookingWizard procedures={procedures} />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
