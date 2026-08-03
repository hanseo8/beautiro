import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatKrw } from "@/lib/hospitals";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CoverImage } from "@/components/ui/CoverImage";
import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";

export type PopularCard = {
  procedureId: string;
  title: string;
  hospitalName: string;
  location: string;
  priceFrom: number;
  category: MedicalCategory;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
};

const categoryStyle: Record<
  MedicalCategory,
  { label: string; gradient: string; badge: string }
> = {
  PLASTIC: {
    label: "PLASTIC",
    gradient: "from-[#4a90d9] to-[#2563eb]",
    badge: "bg-beautiro-primary-deep",
  },
  DERMATOLOGY: {
    label: "SKIN",
    gradient: "from-[#7cb9e8] to-[#4a90d9]",
    badge: "bg-beautiro-primary",
  },
  ORIENTAL: {
    label: "WELLNESS",
    gradient: "from-[#5ba4d9] to-[#3b82f6]",
    badge: "bg-beautiro-ice",
  },
  DENTAL: {
    label: "DENTAL",
    gradient: "from-[#60a5fa] to-[#3b82f6]",
    badge: "bg-beautiro-primary",
  },
};

function listPrice(priceFrom: number, discountPercent: number) {
  if (discountPercent <= 0) return null;
  return Math.round(priceFrom / (1 - discountPercent / 100));
}

export async function PopularEventSection({
  cards,
  locale,
}: {
  cards: PopularCard[];
  locale: Locale;
}) {
  const t = await getTranslations("home.popular");

  return (
    <section className="">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-md bg-beautiro-primary px-2 py-0.5 text-label text-white">
          {t("badge")}
        </span>
      </div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h3 className="text-section-title text-beautiro-charcoal">
          {t("title")}
        </h3>
        <Link
          href="/hospitals"
          className="text-sm font-semibold text-beautiro-muted hover:text-beautiro-primary"
        >
          {t("viewAll")}
        </Link>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const style = categoryStyle[card.category];
          const original = listPrice(card.priceFrom, card.discountPercent);
          const wa = whatsappUrl(
            consultMessage({
              locale,
              procedureName: card.title,
              hospitalName: card.hospitalName,
            }),
          );

          return (
            <li key={card.procedureId}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-beautiro-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-beautiro-primary/30 hover:shadow-[0_8px_30px_rgba(74,144,217,0.12)]">
                <Link
                  href={`/events/${card.procedureId}`}
                  className="block overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <CoverImage
                      src={card.imageUrl}
                      alt={card.title}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-label text-white ${style.badge}`}
                      >
                        {style.label}
                      </span>
                      <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
                        VIP
                      </span>
                    </div>
                    <div>
                      <p className="text-caption opacity-90">
                        {t("discount")}
                      </p>
                      <p className="text-price-lg text-white">
                        {card.discountPercent}%
                      </p>
                    </div>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-4 pt-3">
                  <Link href={`/events/${card.procedureId}`}>
                    <h4 className="text-card-title line-clamp-2 text-beautiro-charcoal group-hover:text-beautiro-primary-deep">
                      {card.title}
                    </h4>
                  </Link>
                  <p className="mt-2 line-clamp-1 text-xs text-beautiro-muted">
                    <span className="text-beautiro-charcoal/80">
                      {card.location}
                    </span>
                    <span className="mx-1 text-beautiro-border">|</span>
                    {card.hospitalName}
                  </p>
                  <div className="mt-3 flex flex-wrap items-end gap-2">
                    <span className="text-caption font-semibold text-beautiro-primary-deep">
                      {card.discountPercent}%
                    </span>
                    <span className="text-lg text-price text-beautiro-charcoal">
                      {formatKrw(card.priceFrom, locale)}
                    </span>
                    {original != null && (
                      <span className="text-xs text-beautiro-muted line-through">
                        {formatKrw(original, locale)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-xs">
                    <Star
                      size={14}
                      className="fill-beautiro-gold text-beautiro-gold"
                    />
                    <span className="font-bold text-beautiro-charcoal">
                      {card.rating.toFixed(1)}
                    </span>
                    <span className="text-beautiro-muted">
                      ({card.reviewCount.toLocaleString(locale === "ko" ? "ko-KR" : locale === "id" ? "id-ID" : "en-US")})
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-beautiro-muted">
                    {t("packageHint")}
                  </p>
                  <div className="mt-3 space-y-2">
                    <WhatsAppButton href={wa} size="sm">
                      {t("consultWhatsApp")}
                    </WhatsAppButton>
                    <Link
                      href={`/book?procedure=${card.procedureId}`}
                      className="block text-center text-xs font-semibold text-beautiro-muted hover:text-beautiro-primary"
                    >
                      {t("bookOnline")}
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
