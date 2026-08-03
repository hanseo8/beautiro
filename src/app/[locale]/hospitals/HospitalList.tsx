"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import type { LocalizedHospital } from "@/lib/hospitals";
import {
  compareRegionGroup,
  formatRegionSectionTitle,
  regionGroupKey,
} from "@/lib/regions";
import { eventInquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { CoverImage } from "@/components/ui/CoverImage";
import { resolveHospitalImage } from "@/lib/media";
import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";
import { MapPin } from "lucide-react";

function HospitalCard({
  h,
  locale,
}: {
  h: LocalizedHospital;
  locale: Locale;
}) {
  const t = useTranslations("hospitals");
  const primary =
    h.procedures.find((p) => p.category === h.primaryCategory) ??
    h.procedures[0];
  const wa = whatsappUrl(
    eventInquiryMessage({
      locale,
      procedureName: primary?.name ?? h.name,
      hospitalName: h.name,
    }),
  );
  const imageUrl = resolveHospitalImage(
    h.slug,
    h.primaryCategory,
    h.coverImage,
  );

  return (
    <article className="card-modern card-modern-hover group flex h-full flex-col overflow-hidden">
      <Link
        href={primary ? `/events/${primary.id}` : "/hospitals"}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <CoverImage
          src={imageUrl}
          alt={h.name}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-beautiro-primary">
            {t(`categories.${h.primaryCategory}`)}
          </span>
          <h2 className="mt-2 text-lg font-bold leading-snug text-white">
            {h.name}
          </h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-white/85">
            <MapPin size={12} />
            {h.regionLabel}
          </p>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-beautiro-muted">
          {h.description}
        </p>
        {h.procedures.length > 0 && (
          <ul className="mt-4 space-y-2">
            {h.procedures.slice(0, 2).map((p) => (
              <li key={p.id}>
                <Link
                  href={`/events/${p.id}`}
                  className="flex items-center justify-between gap-2 rounded-xl bg-beautiro-surface px-3 py-2 text-xs transition-colors hover:bg-beautiro-primary/5"
                >
                  <span className="font-medium text-beautiro-charcoal">
                    {p.name}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-beautiro-muted"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 grid grid-cols-2 gap-2">
          {primary && (
            <Link
              href={`/events/${primary.id}`}
              className="flex h-10 items-center justify-center rounded-xl border border-beautiro-border text-xs font-semibold text-beautiro-charcoal transition-colors hover:border-beautiro-primary/30 hover:text-beautiro-primary"
            >
              {t("viewEvent")}
            </Link>
          )}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-10 items-center justify-center rounded-xl bg-beautiro-primary text-xs font-bold text-white transition-colors hover:bg-beautiro-primary-hover ${primary ? "" : "col-span-2"}`}
          >
            {t("inquireDiscount")}
          </a>
        </div>
      </div>
    </article>
  );
}

export function HospitalList({
  items,
  locale,
}: {
  items: LocalizedHospital[];
  locale: Locale;
}) {
  const t = useTranslations("hospitals");

  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-beautiro-surface py-16 text-center text-sm text-beautiro-muted">
        {t("empty")}
      </p>
    );
  }

  const groups = new Map<string, LocalizedHospital[]>();
  for (const item of items) {
    const key = regionGroupKey(item);
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  const sortedGroups = [...groups.entries()].sort(([, aItems], [, bItems]) =>
    compareRegionGroup(aItems[0]!, bItems[0]!),
  );

  return (
    <div className="space-y-12">
      {sortedGroups.map(([key, groupItems]) => {
        const sample = groupItems[0]!;
        const title = formatRegionSectionTitle(
          sample.provinceKey,
          sample.cityKey,
          sample.districtKey,
          sample.neighborhoodKey,
          (k) => t(k),
        );
        const sortedHospitals = [...groupItems].sort((a, b) => {
          const catOrder = (c: MedicalCategory) =>
            ["PLASTIC", "DERMATOLOGY", "ORIENTAL", "DENTAL"].indexOf(c);
          const diff =
            catOrder(a.primaryCategory) - catOrder(b.primaryCategory);
          if (diff !== 0) return diff;
          return a.name.localeCompare(b.name, locale);
        });

        return (
          <section key={key}>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-label text-beautiro-primary">
                  {t("regionSectionLabel")}
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-beautiro-charcoal">
                  {title}
                </h2>
              </div>
              <p className="text-xs text-beautiro-muted">
                {t("regionHospitalCount", { count: groupItems.length })}
              </p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {sortedHospitals.map((h) => (
                <li key={h.id}>
                  <HospitalCard h={h} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
