import { getTranslations } from "next-intl/server";
import {
  PromoBannerCarousel,
  type PromoSlide,
} from "@/components/home/PromoBannerCarousel";

export async function PromoBannerSection() {
  const tOpen = await getTranslations("home.openPromo");
  const tCosmetics = await getTranslations("home.cosmeticsPromo");

  const slides: PromoSlide[] = [
    {
      type: "openPromo",
      badge: tOpen("badge"),
      title: tOpen("title"),
      subtitle: tOpen("subtitle"),
      ctaEvents: tOpen("ctaEvents"),
      ctaBook: tOpen("ctaBook"),
      benefits: tOpen.raw("benefits") as { title: string; desc: string }[],
    },
    {
      type: "cosmetics",
      badge: tCosmetics("badge"),
      title: tCosmetics("title"),
      subtitle: tCosmetics("subtitle"),
      note: tCosmetics("note"),
      cta: tCosmetics("cta"),
    },
  ];

  return <PromoBannerCarousel slides={slides} />;
}
