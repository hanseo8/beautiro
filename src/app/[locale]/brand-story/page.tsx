import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandStorySection } from "@/components/home/BrandStorySection";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.brandStory" });
  return {
    title: `${t("badge")} — Beautiro`,
    description: t("headline"),
  };
}

export default async function BrandStoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pb-12">
      <BrandStorySection />
    </div>
  );
}
