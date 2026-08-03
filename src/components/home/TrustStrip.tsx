import {
  BadgeCheck,
  Headset,
  Languages,
  CarFront,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function TrustStrip() {
  const t = await getTranslations("home.trust");
  const items = t.raw("items") as { title: string; desc: string }[];

  const icons = [BadgeCheck, Headset, Languages, CarFront];

  return (
    <section className="border-b border-beautiro-border bg-white py-8 md:py-10">
      <div className="container-babitalk">
        <p className="text-label text-beautiro-primary">{t("badge")}</p>
        <h2 className="font-display mt-1 text-xl font-semibold tracking-tight text-beautiro-charcoal md:text-2xl">
          {t("title")}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = icons[i] ?? BadgeCheck;
            return (
              <li
                key={item.title}
                className="flex items-start gap-4 rounded-xl border border-beautiro-border bg-beautiro-surface/50 p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-beautiro-border bg-white text-beautiro-primary">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug text-beautiro-charcoal">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-beautiro-muted">
                    {item.desc}
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
