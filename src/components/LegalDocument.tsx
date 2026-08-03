import { getTranslations } from "next-intl/server";

type Section = {
  title: string;
  paragraphs: string[];
};

export async function LegalDocument({
  namespace,
}: {
  namespace: "terms" | "privacy";
}) {
  const t = await getTranslations(namespace);
  const sections = t.raw("sections") as Section[];

  return (
    <article className="prose-legal">
      <p className="text-sm text-beautiro-muted">{t("effectiveDate")}</p>
      <p className="mt-4 text-sm leading-relaxed text-beautiro-charcoal">
        {t("intro")}
      </p>
      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-bold text-beautiro-charcoal">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-sm leading-relaxed text-beautiro-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-12 border-t border-beautiro-border pt-6 text-xs leading-relaxed text-beautiro-muted-light">
        {t("contactNote")}
      </p>
    </article>
  );
}
