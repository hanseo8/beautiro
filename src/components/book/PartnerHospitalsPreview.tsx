"use client";

import { useTranslations } from "next-intl";
import { Building2, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { LocalizedHospital } from "@/lib/hospitals";

export function PartnerHospitalsPreview({
  hospitals,
}: {
  hospitals: LocalizedHospital[];
}) {
  const t = useTranslations("book");

  if (hospitals.length === 0) return null;

  return (
    <section className="card-modern mx-auto mt-6 max-w-4xl p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-label text-beautiro-primary">{t("partnerHospitals")}</p>
          <p className="mt-1 text-sm text-beautiro-muted">
            {t("partnerHospitalsDesc")}
          </p>
        </div>
        <Link
          href="/hospitals"
          className="text-xs font-semibold text-beautiro-primary hover:underline"
        >
          {t("viewAllHospitals")}
        </Link>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {hospitals.map((h) => (
          <li key={h.id}>
            <Link
              href={`/hospitals?q=${encodeURIComponent(h.name)}`}
              className="flex items-start gap-3 rounded-xl border border-beautiro-border bg-beautiro-surface/50 px-4 py-3 transition-colors hover:border-beautiro-primary/30 hover:bg-beautiro-primary/5"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-beautiro-primary">
                <Building2 size={16} strokeWidth={1.5} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-beautiro-charcoal">
                  {h.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-beautiro-muted">
                  <MapPin size={11} className="shrink-0" />
                  <span className="truncate">{h.regionLabel}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
