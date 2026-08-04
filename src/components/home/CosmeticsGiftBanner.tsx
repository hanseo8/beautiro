import { ArrowRight, Gift, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

function SparklePattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <pattern
          id="cosmetics-sparkle"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="8" cy="8" r="1" fill="#c4a962" opacity="0.25" />
          <circle cx="32" cy="24" r="0.8" fill="#c4a962" opacity="0.18" />
          <circle cx="20" cy="40" r="1.2" fill="#d4a5a5" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cosmetics-sparkle)" />
    </svg>
  );
}

export async function CosmeticsGiftBanner() {
  const t = await getTranslations("home.cosmeticsPromo");

  return (
    <section className="container-babitalk pb-2 pt-2">
      <div className="relative overflow-hidden rounded-2xl border border-[#e8d4c4]/80 shadow-[0_8px_32px_rgba(196,169,98,0.12)]">
        {/* Layered blush + champagne background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 80% at 100% 0%, rgba(244,200,200,0.45) 0%, transparent 55%),
              radial-gradient(ellipse 50% 60% at 0% 100%, rgba(196,169,98,0.22) 0%, transparent 50%),
              radial-gradient(ellipse 40% 50% at 70% 80%, rgba(255,240,245,0.8) 0%, transparent 45%),
              linear-gradient(115deg, #fdf4eb 0%, #fff9f5 35%, #f8f0f6 70%, #faf6f0 100%)
            `,
          }}
        />
        <SparklePattern />
        <div className="pointer-events-none absolute -right-8 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#f4c8c8]/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-4 -top-6 h-32 w-32 rounded-full bg-[#c4a962]/15 blur-2xl" />
        {/* Decorative ribbon diagonal */}
        <div
          className="pointer-events-none absolute -right-16 top-0 h-full w-48 rotate-12 opacity-[0.12]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #c4a962 45%, #d4a5a5 55%, transparent 100%)",
          }}
        />
        {/* Large gift icon watermark */}
        <Gift
          className="pointer-events-none absolute -bottom-6 -right-2 h-36 w-36 text-[#c4a962]/[0.08] sm:h-44 sm:w-44"
          strokeWidth={0.75}
        />

        <div className="relative px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f5e6d3] to-[#e8d4c4] text-[#9a7b4f] shadow-[0_4px_12px_rgba(196,169,98,0.2)] ring-1 ring-[#c4a962]/30">
                <Gift size={22} strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c4a962]/30 bg-white/60 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#9a7b4f] backdrop-blur-sm">
                  <Sparkles size={11} className="text-[#c4a962]" />
                  {t("badge")}
                </div>
                <h2 className="font-display mt-2 text-lg font-semibold leading-snug tracking-tight text-beautiro-charcoal sm:text-xl">
                  {t("title")}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-beautiro-muted">
                  {t("subtitle")}
                </p>
                <p className="mt-2 text-xs text-beautiro-muted-light">
                  {t("note")}
                </p>
              </div>
            </div>

            <Link
              href="/book"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 self-start rounded-lg bg-gradient-to-r from-beautiro-primary to-[#2d7a7a] px-5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(26,95,95,0.25)] transition-all hover:shadow-[0_6px_20px_rgba(26,95,95,0.3)] sm:self-center"
            >
              {t("cta")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
