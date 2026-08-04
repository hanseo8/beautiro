import { ArrowRight, Building2, Plane, Sparkles, Wallet } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function OpenPromoBanner() {
  const t = await getTranslations("home.openPromo");
  const benefits = t.raw("benefits") as { title: string; desc: string }[];
  const icons = [Wallet, Plane, Building2];

  return (
    <section className="container-babitalk -mt-2 pb-2">
      <div className="relative overflow-hidden rounded-2xl border border-beautiro-primary/20 bg-gradient-to-br from-beautiro-primary-deep via-beautiro-primary to-[#2d7a7a] px-6 py-7 text-white shadow-[0_12px_40px_rgba(26,95,95,0.2)] sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles size={12} />
              {t("badge")}
            </div>
            <h2 className="font-display mt-3 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              {t("subtitle")}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/hospitals"
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-white px-5 text-sm font-bold text-beautiro-primary transition-colors hover:bg-white/95"
              >
                {t("ctaEvents")}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/book"
                className="inline-flex h-10 items-center rounded-lg border border-white/35 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t("ctaBook")}
              </Link>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 lg:max-w-[28rem] lg:shrink-0">
            {benefits.map((item, i) => {
              const Icon = icons[i] ?? Sparkles;
              return (
                <li
                  key={item.title}
                  className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-snug">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/75">
                    {item.desc}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
