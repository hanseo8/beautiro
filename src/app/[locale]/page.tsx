export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeSearch } from "@/components/home/HomeSearch";
import { TrustStrip } from "@/components/home/TrustStrip";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryPanels } from "@/components/home/CategoryPanels";
import {
  PopularEventSection,
  type PopularCard,
} from "@/components/home/PopularEventSection";
import { AppPromoBanner } from "@/components/home/AppPromoBanner";
import { prisma } from "@/lib/prisma";
import { localizeHospital } from "@/lib/hospitals";
import { resolveHospitalImage } from "@/lib/media";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.faq");
  const loc = locale as Locale;

  const hospitals = await prisma.hospital.findMany({
    include: { procedures: true },
  });

  const cards: PopularCard[] = hospitals
    .flatMap((h, hi) => {
      const item = localizeHospital(h, loc);
      return item.procedures.map((p, pi) => ({
        procedureId: p.id,
        title: p.name,
        hospitalName: item.name,
        location: [item.city, item.district].filter(Boolean).join(" "),
        priceFrom: p.priceFrom ?? 500000,
        category: p.category,
        discountPercent: [49, 45, 42, 38, 35, 40][(hi + pi) % 6],
        rating: 4.9,
        reviewCount: 89 + hi * 40 + pi * 17,
        imageUrl: resolveHospitalImage(h.slug, p.category, h.coverImage),
      }));
    })
    .slice(0, 8);

  return (
    <div className="pb-12">
      <div className="container-babitalk pt-8 pb-10">
        <HomeSearch />
      </div>
      <TrustStrip />
      <div className="container-babitalk space-y-14 pt-10">
        <HeroCarousel />
        <CategoryPanels />
        <PopularEventSection cards={cards} locale={loc} />
        <AppPromoBanner />
      </div>

      <section
        id="faq"
        className="mt-16 border-t border-beautiro-border bg-beautiro-surface py-16"
      >
        <div className="container-babitalk">
          <h3 className="text-section-title">{t("title")}</h3>
          <dl className="mt-6 grid gap-6 md:grid-cols-3">
            {(t.raw("items") as { q: string; a: string }[]).map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-beautiro-border bg-white p-5"
              >
                <dt className="text-sm font-bold">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-beautiro-muted">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
