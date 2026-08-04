import { ArrowRight, Gift, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function CosmeticsGiftBanner() {
  const t = await getTranslations("home.cosmeticsPromo");

  return (
    <section className="container-babitalk pb-2 pt-2">
      <div className="relative overflow-hidden rounded-2xl border border-beautiro-accent/30 bg-gradient-to-r from-[#faf8f3] via-white to-[#f4f8f7] px-6 py-6 shadow-sm sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-6 top-0 h-32 w-32 rounded-full bg-beautiro-accent/10" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-beautiro-primary/5" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-beautiro-accent/25 bg-beautiro-accent/10 text-beautiro-accent-hover">
              <Gift size={22} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-beautiro-accent/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-beautiro-accent-hover">
                <Sparkles size={11} />
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
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 self-start rounded-lg bg-beautiro-primary px-5 text-sm font-bold text-white transition-colors hover:bg-beautiro-primary-hover sm:self-center"
          >
            {t("cta")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
