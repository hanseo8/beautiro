"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const inputClass =
  "w-full rounded-xl border border-beautiro-border px-4 py-3 text-sm outline-none focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale() as Locale;
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) throw new Error("failed");
      setSent(true);
    } catch {
      setError(t("genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md py-8">
      <h1 className="font-display text-2xl font-semibold text-beautiro-charcoal">
        {t("forgotTitle")}
      </h1>
      <p className="mt-2 text-sm text-beautiro-muted">{t("forgotDesc")}</p>

      {sent ? (
        <p className="mt-6 rounded-xl bg-beautiro-surface px-4 py-4 text-sm text-beautiro-charcoal">
          {t("forgotSent")}
        </p>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 grid gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            required
            className={inputClass}
          />
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-xl bg-beautiro-primary text-sm font-semibold text-white disabled:opacity-40"
          >
            {submitting ? t("submitting") : t("forgotButton")}
          </button>
        </form>
      )}

      <p className="mt-6">
        <Link href="/book?tab=account" className="text-sm font-medium text-beautiro-primary hover:underline">
          {t("backToAccount")}
        </Link>
      </p>
    </div>
  );
}
