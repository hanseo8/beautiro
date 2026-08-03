import type { ReactNode } from "react";
import { Car, Languages, Wallet } from "lucide-react";

const icons = {
  van: Car,
  mate: Languages,
  pay: Wallet,
} as const;

export type ServiceShowcaseKey = keyof typeof icons;

export function ServiceShowcase({
  items,
}: {
  items: {
    key: ServiceShowcaseKey;
    index: string;
    title: string;
    description: string;
  }[];
}) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item) => {
        const Icon = icons[item.key];
        return (
          <article
            key={item.key}
            className="group flex flex-col border border-beautiro-border bg-beautiro-surface/80 p-8 transition-[border-color,box-shadow] duration-300 hover:border-beautiro-charcoal/20 hover:shadow-[0_12px_40px_-24px_rgba(17,17,17,0.25)]"
          >
            <div className="overflow-hidden border border-beautiro-border/80 bg-beautiro-sand">
              <div className="relative flex aspect-[5/4] items-center justify-center transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                <div className="absolute inset-0 bg-[linear-gradient(145deg,#f5f5f0_0%,#ebeae4_100%)]" />
                <Icon
                  className="relative z-10 text-beautiro-charcoal/35"
                  size={40}
                  strokeWidth={1.25}
                  aria-hidden
                />
              </div>
            </div>
            <p className="mt-8 text-step-num text-beautiro-muted">
              {item.index}
            </p>
            <h3 className="font-brand mt-3 text-2xl font-semibold text-beautiro-charcoal">
              {item.title}
            </h3>
            <p className="mt-4 flex-1 text-sm leading-[1.75] tracking-wide text-beautiro-muted">
              {item.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}
