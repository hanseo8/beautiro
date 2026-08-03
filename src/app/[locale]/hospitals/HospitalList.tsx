"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatKrw, type LocalizedHospital } from "@/lib/hospitals";
import {
  compareRegionGroup,
  formatRegionSectionTitle,
  regionGroupKey,
} from "@/lib/regions";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CoverImage } from "@/components/ui/CoverImage";
import { resolveHospitalImage } from "@/lib/media";
import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";
import { MapPin, Star } from "lucide-react";

function CategoryBadge({
  category,
  primary,
}: {
  category: MedicalCategory;
  primary?: boolean;
}) {
  const t = useTranslations("hospitals");
  return (
    <span
      className={
        primary
          ? "rounded-md bg-beautiro-primary px-2 py-0.5 text-[11px] font-bold text-white"
          : "rounded-md border border-beautiro-border bg-white px-2 py-0.5 text-[11px] font-semibold text-beautiro-muted"
      }
    >
      {t(`categories.${category}`)}
    </span>
  );
}

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
  const min = h.procedures
    .map((p) => p.priceFrom)
    .filter((p): p is number => p != null)
    .sort((a, b) => a - b)[0];
  const wa = whatsappUrl(
    consultMessage({
      locale,
      procedureName: primary?.name,
      hospitalName: h.name,
    }),
  );
  const imageUrl = resolveHospitalImage(
    h.slug,
    h.primaryCategory,
    h.coverImage,
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-beautiro-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md">
      <Link
        href={primary ? `/events/${primary.id}` : "/hospitals"}
        className="block overflow-hidden"
      >
        <div className="relative aspect-[16/9]">
          <CoverImage src={imageUrl} alt={h.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex flex-wrap gap-1.5">
              <CategoryBadge category={h.primaryCategory} primary />
              {h.categories
                .filter((c) => c !== h.primaryCategory)
                .map((c) => (
                  <CategoryBadge key={c} category={c} />
                ))}
            </div>
            <h2 className="mt-2 text-lg font-bold leading-snug">{h.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/85">
              <MapPin size={12} className="shrink-0" />
              {h.regionLabel}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-beautiro-muted">
          {h.description}
        </p>
        {h.procedures.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-beautiro-border pt-3">
            {h.procedures.slice(0, 3).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="text-beautiro-charcoal">{p.name}</span>
                {p.priceFrom != null && (
                  <span className="shrink-0 font-semibold text-beautiro-primary">
                    {formatKrw(p.priceFrom, locale)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        {min != null && (
          <p className="mt-3 text-sm text-beautiro-muted">
            {t("from")}{" "}
            <span className="text-base text-price text-beautiro-charcoal">
              {formatKrw(min, locale)}
            </span>
          </p>
        )}
        <div className="mt-2 flex items-center gap-1 text-xs">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="font-bold">4.9</span>
          <span className="text-beautiro-muted">(120+)</span>
        </div>
        <div className="mt-4 space-y-2">
          <WhatsAppButton href={wa} size="sm">
            {t("whatsappConsult")}
          </WhatsAppButton>
          {primary && (
            <Link
              href={`/events/${primary.id}`}
              className="block text-center text-xs font-semibold text-beautiro-muted hover:text-beautiro-primary"
            >
              {t("viewEvent")}
            </Link>
          )}
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
      <p className="mt-10 rounded-2xl border border-beautiro-border bg-beautiro-surface py-12 text-center text-sm text-beautiro-muted">
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
    <div className="mt-8 space-y-10">
      {sortedGroups.map(([key, groupItems]) => {
        const sample = groupItems[0]!;
        const title = formatRegionSectionTitle(
          sample.provinceKey,
          sample.cityKey,
          sample.districtKey,
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
            <div className="flex flex-wrap items-end justify-between gap-2 border-b border-beautiro-border pb-3">
              <div>
                <p className="text-label text-beautiro-primary">
                  {t("regionSectionLabel")}
                </p>
                <h2 className="text-section-title text-beautiro-charcoal">
                  {title}
                </h2>
              </div>
              <p className="text-xs text-beautiro-muted">
                {t("regionHospitalCount", { count: groupItems.length })}
              </p>
            </div>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
