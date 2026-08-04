"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";

type BookingRow = {
  id: string;
  status: string;
  createdAt: string;
  preferredDate: string | null;
  arrivalDate: string | null;
  services: { type: string }[];
  procedure: { nameKo: string; nameEn: string; nameId: string } | null;
};

export function BookingHistoryPanel({ wa }: { wa: string }) {
  const t = useTranslations("book");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  async function loadHistory(params?: { email: string; phone: string }) {
    setLoading(true);
    setError(null);
    try {
      const query = params
        ? `?email=${encodeURIComponent(params.email)}&phone=${encodeURIComponent(params.phone)}`
        : "";
      const res = await fetch(`/api/bookings${query}`);
      const data = (await res.json()) as {
        bookings?: BookingRow[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setBookings(data.bookings ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      setBookings(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function loadSessionHistory() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = (await meRes.json()) as {
          user?: { email: string; phone: string | null } | null;
        };
        if (cancelled || !meData.user) return;
        setLoggedIn(true);
        if (meData.user.email) setEmail(meData.user.email);
        if (meData.user.phone) setPhone(meData.user.phone);
        await loadHistory();
      } catch {
        // guest lookup only
      }
    }
    void loadSessionHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="py-2">
      <h2 className="font-display text-xl font-semibold text-beautiro-charcoal">
        {t("historyTitle")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-beautiro-muted">
        {loggedIn ? t("historyLoggedInDesc") : t("historyLookupDesc")}
      </p>

      {!loggedIn && (
        <div className="mt-5 grid gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-xl border border-beautiro-border px-4 py-3 text-sm outline-none focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("phonePlaceholder")}
            className="w-full rounded-xl border border-beautiro-border px-4 py-3 text-sm outline-none focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10"
          />
          <button
            type="button"
            onClick={() =>
              void loadHistory({ email: email.trim(), phone: phone.trim() })
            }
            disabled={loading || !email.includes("@") || phone.trim().length < 6}
            className="h-11 rounded-xl bg-beautiro-primary text-sm font-semibold text-white transition-colors hover:bg-beautiro-primary-hover disabled:opacity-40"
          >
            {loading ? t("historyLoading") : t("historyLookup")}
          </button>
        </div>
      )}

      {loggedIn && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void loadHistory()}
            disabled={loading}
            className="h-10 rounded-xl bg-beautiro-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-beautiro-primary-hover disabled:opacity-40"
          >
            {loading ? t("historyLoading") : t("historyRefresh")}
          </button>
          <Link
            href="/book?tab=account"
            className="text-sm font-medium text-beautiro-primary hover:underline"
          >
            {t("historyAccountLink")}
          </Link>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      {bookings && bookings.length === 0 && (
        <p className="mt-6 rounded-xl bg-beautiro-surface py-8 text-center text-sm text-beautiro-muted">
          {t("historyEmpty")}
        </p>
      )}

      {bookings && bookings.length > 0 && (
        <ul className="mt-6 space-y-3">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="rounded-xl border border-beautiro-border bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-beautiro-primary">
                    {t(`status.${booking.status}`)}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-beautiro-muted">
                    {booking.id}
                  </p>
                </div>
                <CalendarCheck size={18} className="shrink-0 text-beautiro-primary" />
              </div>
              {booking.preferredDate && (
                <p className="mt-3 text-sm text-beautiro-charcoal">
                  {t("preferred")}:{" "}
                  {new Date(booking.preferredDate).toLocaleDateString()}
                </p>
              )}
              <p className="mt-1 text-xs text-beautiro-muted">
                {booking.services
                  .map((s) => t(`serviceType.${s.type}`))
                  .join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      )}

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-beautiro-primary hover:underline"
      >
        <MessageCircle size={16} />
        {t("historyContact")}
      </a>
    </div>
  );
}
