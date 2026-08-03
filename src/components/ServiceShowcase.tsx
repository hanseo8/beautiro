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
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const Icon = icons[item.key];
        return (
          <article
            key={item.key}
            className="flex flex-col rounded-xl border border-beautiro-border bg-white p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-beautiro-border bg-beautiro-surface text-beautiro-primary">
                <Icon size={22} strokeWidth={1.5} aria-hidden />
              </div>
              <div>
                <p className="text-step-num text-beautiro-muted">{item.index}</p>
                <h3 className="mt-0.5 text-base font-semibold text-beautiro-charcoal">
                  {item.title}
                </h3>
              </div>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-beautiro-muted">
              {item.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}
