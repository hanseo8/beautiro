"use client";

import { Building2, Plane, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

export function BookingBenefitsStrip() {
  const t = useTranslations("home.openPromo");
  const benefits = t.raw("benefits") as { title: string; desc: string }[];
  const icons = [Wallet, Plane, Building2];

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {benefits.map((item, i) => {
        const Icon = icons[i] ?? Wallet;
        return (
          <div
            key={item.title}
            className="flex items-start gap-3 rounded-xl border border-beautiro-border bg-white p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-beautiro-primary/10 text-beautiro-primary">
              <Icon size={17} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-beautiro-charcoal">
                {item.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-beautiro-muted">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
