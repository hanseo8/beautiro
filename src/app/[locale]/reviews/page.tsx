import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ReviewForm } from "@/components/reviews/ReviewForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container-babitalk py-10 sm:py-14">
      <ReviewForm />
    </div>
  );
}
