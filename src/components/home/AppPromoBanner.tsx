import { getTranslations } from "next-intl/server";
import { QrCode } from "lucide-react";

export async function AppPromoBanner() {
  const t = await getTranslations("home.app");

  return (
    <section className="card-modern bg-gradient-to-br from-beautiro-surface to-white px-6 py-10 sm:px-10">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="max-w-md text-center md:text-left">
          <h3 className="text-section-title text-beautiro-charcoal">
            {t("title")}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-beautiro-muted">
            {t("description")}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-beautiro-border bg-white">
            <QrCode size={64} className="text-beautiro-charcoal" strokeWidth={1} />
          </div>
          <p className="text-xs text-beautiro-muted">{t("qrHint")}</p>
        </div>
      </div>
    </section>
  );
}
