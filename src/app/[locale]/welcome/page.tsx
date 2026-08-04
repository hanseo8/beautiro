import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { WelcomePageContent } from "@/components/welcome/WelcomePageContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "welcome" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function WelcomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WelcomePageContent />;
}
