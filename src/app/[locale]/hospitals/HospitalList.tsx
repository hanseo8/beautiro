"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatKrw } from "@/lib/hospitals";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CoverImage } from "@/components/ui/CoverImage";
import { resolveHospitalImage } from "@/lib/media";
import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";
import { Star } from "lucide-react";

type Item = {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  district: string | null;
  coverImage: string | null;
  procedures: {
    id: string;
    category: MedicalCategory;
    name: string;
    priceFrom: number | null;
  }[];
};

export function HospitalList({
  items,
  locale,
}: {
  items: Item[];
  locale: Locale;
}) {
  const t = useTranslations("hospitals");
  const loc = useLocale() as Locale;

  if (items.length === 0) {
    return (
      <p className="mt-10 rounded-2xl border border-beautiro-border bg-beautiro-surface py-12 text-center text-sm text-beautiro-muted">
        {t("empty")}
      </p>
    );
  }

  return (
    <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((h) => {
        const primary = h.procedures[0];
        const min = h.procedures
          .map((p) => p.priceFrom)
          .filter((p): p is number => p != null)
          .sort((a, b) => a - b)[0];
        const wa = whatsappUrl(
          consultMessage({
            locale: loc,
            procedureName: primary?.name,
            hospitalName: h.name,
          }),
        );

        const imageUrl = resolveHospitalImage(
          h.slug,
          primary?.category ?? "PLASTIC",
          h.coverImage,
        );

        return (
          <li key={h.id}>
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-beautiro-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md">
              <Link
                href={primary ? `/events/${primary.id}` : "/hospitals"}
                className="block overflow-hidden"
              >
                <div className="relative aspect-[16/9]">
                  <CoverImage src={imageUrl} alt={h.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-caption font-semibold text-white/90">
                  {primary
                    ? t(`categories.${primary.category}`)
                    : t("title")}
                </p>
                <h2 className="mt-1 text-lg font-bold leading-snug">{h.name}</h2>
                <p className="mt-1 text-xs text-white/80">
                  {h.city}
                  {h.district ? ` · ${h.district}` : ""}
                </p>
                  </div>
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-beautiro-muted">
                  {h.description}
                </p>
                {min != null && (
                  <p className="mt-3 text-base text-price">
                    {t("from")} {formatKrw(min, locale)}
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
          </li>
        );
      })}
    </ul>
  );
}
