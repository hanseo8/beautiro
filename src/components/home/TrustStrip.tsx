import { ShieldCheck, Clock, Languages, Car } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function TrustStrip() {
  const t = await getTranslations("home.trust");
  const items = t.raw("items") as { title: string; desc: string }[];

  const icons = [ShieldCheck, Clock, Languages, Car];

  return (
    <section className="border-b border-beautiro-border bg-beautiro-surface-blue">
      <div className="container-babitalk grid grid-cols-2 gap-5 py-7 md:grid-cols-4 md:gap-8 md:py-9">
        {items.map((item, i) => {
          const Icon = icons[i] ?? ShieldCheck;
          return (
            <div key={item.title} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-beautiro-border bg-white text-beautiro-primary">
                <Icon size={20} strokeWidth={1.5} />
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
