import { BadgeCheck, CarFront, Languages } from "lucide-react";
import { getTranslations } from "next-intl/server";

const pillarIcons = [BadgeCheck, Languages, CarFront];

export async function BrandStorySection() {
  const t = await getTranslations("home.brandStory");
  const questions = t.raw("questions") as string[];
  const paragraphs = t.raw("paragraphs") as string[];
  const pillars = t.raw("pillars") as { title: string; desc: string }[];

  return (
    <section
      id="brand-story"
      className="scroll-mt-20 border-b border-beautiro-border bg-white py-10 md:py-14"
    >
      <div className="container-babitalk">
        <div className="mx-auto max-w-3xl">
          <p className="text-label text-beautiro-primary">{t("badge")}</p>
          <h2 className="font-display mt-2 text-2xl font-semibold leading-snug tracking-tight text-beautiro-charcoal md:text-3xl">
            {t("headline")}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-beautiro-muted md:text-base">
            {t("intro")}
          </p>

          <ul className="mt-5 space-y-2 border-l-2 border-beautiro-primary/25 pl-4">
            {questions.map((question) => (
              <li
                key={question}
                className="text-sm leading-relaxed text-beautiro-charcoal md:text-base"
              >
                &ldquo;{question}&rdquo;
              </li>
            ))}
          </ul>

          <p className="mt-5 text-sm font-medium leading-relaxed text-beautiro-charcoal md:text-base">
            {t("origin")}
          </p>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-beautiro-muted md:text-base">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-8 rounded-xl border border-beautiro-primary/15 bg-beautiro-primary/5 px-5 py-4 text-sm font-semibold leading-relaxed text-beautiro-primary md:text-base">
            {t("closing")}
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillarIcons[index] ?? BadgeCheck;
            return (
              <li
                key={pillar.title}
                className="flex items-start gap-4 rounded-xl border border-beautiro-border bg-beautiro-surface/50 p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-beautiro-border bg-white text-beautiro-primary">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug text-beautiro-charcoal">
                    {pillar.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-beautiro-muted">
                    {pillar.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
