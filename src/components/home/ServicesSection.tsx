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

      <div className="card-modern mt-6 p-6 sm:p-8">
        <h3 className="text-base font-semibold text-beautiro-charcoal">
          {t("introTitle")}
        </h3>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-beautiro-muted">
          {(t.raw("intro") as string[]).map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {(t.raw("highlights") as string[]).map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-beautiro-charcoal"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-beautiro-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <h3 className="mt-10 text-base font-semibold text-beautiro-charcoal">
        {t("servicesHeading")}
      </h3>
      <div className="mt-4">
        <ServiceShowcase items={items} />
      </div>
    </section>
  );
}
