import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConsultationEntry } from "@/components/home/ConsultationEntry";
import { FaceTreatmentExplorer } from "@/components/FaceTreatmentExplorer";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { locale } = await params;
 const t = await getTranslations({ locale, namespace: "meta" });
 return { title: t("title"), description: t("description") };
}

export default async function HomePage({ params }: Props) {
 const { locale } = await params;
 setRequestLocale(locale);
 return <div className="container-babitalk space-y-8 py-8 sm:space-y-10 sm:py-10">
  <ConsultationEntry />
  <FaceTreatmentExplorer />
 </div>;
}
