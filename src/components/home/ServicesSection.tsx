import { getTranslations } from "next-intl/server";
import { ServiceShowcase } from "@/components/ServiceShowcase";

export async function ServicesSection() {
  const t = await getTranslations("services");

  const items = [
    {
      key: "van" as const,
      index: "01",
      title: t("van.title"),
      description: t("van.desc"),
    },
    {
      key: "mate" as const,
      index: "02",
      title: t("mate.title"),
      description: t("mate.desc"),
    },
    {
      key: "pay" as const,
      index: "03",
      title: t("pay.title"),
      description: t("pay.desc"),
    },
  ];

  return (
    <section id="services" className="scroll-mt-20">
      <p className="text-label text-beautiro-primary">{t("badge")}</p>
      <h2 className="font-display mt-1 text-xl font-semibold tracking-tight text-beautiro-charcoal md:text-2xl">
        {t("title")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-beautiro-muted">
        {t("subtitle")}
      </p>
      <div className="mt-8">
        <ServiceShowcase items={items} />
      </div>
    </section>
  );
}
