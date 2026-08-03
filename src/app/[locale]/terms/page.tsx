import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalDocument } from "@/components/LegalDocument";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return { title: t("metaTitle") };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

  return (
    <div className="bg-beautiro-surface py-10">
      <div className="container-babitalk max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-beautiro-charcoal">
          {t("title")}
        </h1>
        <div className="mt-8 rounded-2xl border border-beautiro-border bg-white p-6 sm:p-10">
          <LegalDocument namespace="terms" />
        </div>
      </div>
    </div>
  );
}
