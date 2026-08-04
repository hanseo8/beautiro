"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { ProcedureOption } from "@/components/BookingWizard";
import { OnlineBookingFlow } from "@/components/book/OnlineBookingFlow";
import { BookingHistoryPanel } from "@/components/book/BookingHistoryPanel";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/routing";
import { useLocale } from "next-intl";

export function BookingsHub({
  procedures,
  defaultView = "new",
}: {
  procedures: ProcedureOption[];
  defaultView?: "new" | "history";
}) {
  const t = useTranslations("book.onlineBooking");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const view =
    searchParams.get("view") === "history" || defaultView === "history"
      ? "history"
      : "new";
  const wa = whatsappUrl(consultMessage({ locale }));

  return (
    <div>
      <div className="text-center lg:text-left">
        <p className="text-label text-beautiro-primary">{t("eyebrow")}</p>
        <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-beautiro-charcoal">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-beautiro-muted">{t("subtitle")}</p>
      </div>

      <div className="mt-6 flex rounded-xl border border-beautiro-border bg-beautiro-surface/60 p-1">
        <Link
          href="/book?tab=bookings"
          className={`flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-semibold transition-colors ${
            view === "new"
              ? "bg-white text-beautiro-primary shadow-sm"
              : "text-beautiro-muted hover:text-beautiro-charcoal"
          }`}
        >
          {t("tabNew")}
        </Link>
        <Link
          href="/book?tab=bookings&view=history"
          className={`flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-semibold transition-colors ${
            view === "history"
              ? "bg-white text-beautiro-primary shadow-sm"
              : "text-beautiro-muted hover:text-beautiro-charcoal"
          }`}
        >
          {t("tabHistory")}
        </Link>
      </div>

      <div className="mt-6">
        {view === "history" ? (
          <BookingHistoryPanel wa={wa} />
        ) : (
          <OnlineBookingFlow procedures={procedures} />
        )}
      </div>
    </div>
  );
}
