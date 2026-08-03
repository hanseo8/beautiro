import { BadgeCheck, Headset, Languages, CarFront } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function TrustStrip() {
  const t = await getTranslations("home.trust");
  const items = t.raw("items") as { title: string; desc: string }[];

  const icons = [BadgeCheck, Headset, Languages, CarFront];

  return (
    <section className="border-b border-beautiro-border bg-beautiro-surface">
      <div className="container-babitalk grid grid-cols-2 gap-5 py-7 md:grid-cols-4 md:gap-8 md:py-9">
        {items.map((item, i) => {
          const Icon = icons[i] ?? BadgeCheck;
          return (
            <div key={item.title} className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-beautiro-primary/10 text-beautiro-primary">
                <Icon size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-bold text-beautiro-charcoal">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-beautiro-muted">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
