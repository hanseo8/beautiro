import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { eventInquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { CoverImage } from "@/components/ui/CoverImage";
import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";

export type PopularCard = {
  procedureId: string;
  title: string;
  hospitalName: string;
  location: string;
  category: MedicalCategory;
  imageUrl: string;
  imagePosition: string;
};

export async function PopularEventSection({
  cards,
  locale,
}: {
  cards: PopularCard[];
  locale: Locale;
}) {
  const t = await getTranslations("home.popular");
  const tCat = await getTranslations("hospitals.categories");

  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-label text-beautiro-primary">{t("badge")}</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-beautiro-charcoal">
            {t("title")}
          </h3>
          <p className="mt-1 text-sm text-beautiro-muted">{t("subtitle")}</p>
        </div>
        <Link
          href="/hospitals"
          className="hidden items-center gap-1 text-sm font-semibold text-beautiro-primary hover:underline sm:inline-flex"
        >
          {t("viewAll")}
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const wa = whatsappUrl(
            eventInquiryMessage({
              locale,
              procedureName: card.title,
              hospitalName: card.hospitalName,
            }),
          );

          return (
            <li key={card.procedureId}>
              <article className="card-modern card-modern-hover group flex h-full flex-col overflow-hidden">
                <Link
                  href={`/events/${card.procedureId}`}
                  className="relative block aspect-[5/4] overflow-hidden"
                >
                  <CoverImage
                    src={card.imageUrl}
                    alt={card.hospitalName}
                    objectPosition={card.imagePosition}
                    className="transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/75 via-[#0f172a]/10 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold tracking-wide text-beautiro-primary backdrop-blur-sm">
                      {t("discountBadge")}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-white/75">
                      {tCat(card.category)}
                    </p>
                    <p className="mt-1 text-base font-bold leading-snug text-white">
                      {card.hospitalName}
                    </p>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-4">
                  <Link href={`/events/${card.procedureId}`}>
                    <p className="text-sm font-semibold leading-snug text-beautiro-charcoal group-hover:text-beautiro-primary">
                      {card.title}
                    </p>
                  </Link>
                  <p className="mt-1.5 line-clamp-1 text-xs text-beautiro-muted">
                    {card.location}
                  </p>
                  <p className="mt-3 flex-1 text-xs leading-relaxed text-beautiro-muted">
                    {t("inquiryHint")}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/events/${card.procedureId}`}
                      className="flex h-10 items-center justify-center rounded-xl bg-beautiro-surface text-xs font-semibold text-beautiro-charcoal transition-colors hover:bg-beautiro-primary/10 hover:text-beautiro-primary"
                    >
                      {t("viewDetail")}
                    </Link>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 items-center justify-center rounded-xl bg-beautiro-primary text-xs font-bold text-white transition-colors hover:bg-beautiro-primary-hover"
                    >
                      {t("inquire")}
                    </a>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <Link
        href="/hospitals"
        className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-beautiro-primary sm:hidden"
      >
        {t("viewAll")}
        <ArrowUpRight size={16} />
      </Link>
    </section>
  );
}
