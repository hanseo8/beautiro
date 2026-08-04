import { ArrowRight, Building2, Plane, Sparkles, Wallet } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

function MeshPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
      aria-hidden
    >
      <defs>
        <pattern
          id="open-promo-grid"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M32 0H0V32"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#open-promo-grid)" />
    </svg>
  );
}

export async function OpenPromoBanner() {
  const t = await getTranslations("home.openPromo");
  const benefits = t.raw("benefits") as { title: string; desc: string }[];
  const icons = [Wallet, Plane, Building2];

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl border border-[#c4a962]/25 shadow-[0_16px_48px_rgba(15,69,69,0.28)]">
        {/* Layered background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 0% 0%, rgba(196,169,98,0.35) 0%, transparent 55%),
              radial-gradient(ellipse 70% 80% at 100% 100%, rgba(45,122,122,0.5) 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 85% 15%, rgba(255,255,255,0.08) 0%, transparent 45%),
              linear-gradient(128deg, #0a3d3d 0%, #1a5f5f 38%, #144d4d 68%, #0f4545 100%)
            `,
          }}
        />
        <MeshPattern />
        <div className="pointer-events-none absolute -left-10 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#c4a962]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-6 -top-10 h-56 w-56 rounded-full bg-[#3d8a7a]/30 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#c4a962]/80 via-[#c4a962]/30 to-transparent" />

        <div className="relative px-6 py-7 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c4a962]/40 bg-[#c4a962]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f0e4c4] backdrop-blur-sm">
                <Sparkles size={12} className="text-[#c4a962]" />
                {t("badge")}
              </div>
              <h2 className="font-display mt-3 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                {t("title")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/88">
                {t("subtitle")}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/hospitals"
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#c4a962] px-5 text-sm font-bold text-[#0f4545] shadow-[0_4px_14px_rgba(196,169,98,0.35)] transition-colors hover:bg-[#d4b872]"
                >
                  {t("ctaEvents")}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/book"
                  className="inline-flex h-10 items-center rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/18"
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
                    className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-white/25 to-white/5 ring-1 ring-white/20">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-snug">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/72">
                      {item.desc}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
