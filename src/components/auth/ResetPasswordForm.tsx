"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const inputClass =
  "w-full rounded-xl border border-beautiro-border px-4 py-3 text-sm outline-none focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error === "INVALID_TOKEN" ? t("invalidResetToken") : t("genericError"));
        return;
      }
      setDone(true);
    } catch {
      setError(t("genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md py-8">
        <p className="rounded-xl bg-red-50 px-4 py-4 text-sm text-red-800">{t("invalidResetToken")}</p>
        <Link href="/auth/forgot-password" className="mt-4 inline-block text-sm font-medium text-beautiro-primary hover:underline">
          {t("forgotTitle")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-8">
      <h1 className="font-display text-2xl font-semibold text-beautiro-charcoal">
        {t("resetTitle")}
      </h1>
      <p className="mt-2 text-sm text-beautiro-muted">{t("resetDesc")}</p>

      {done ? (
        <div className="mt-6">
          <p className="rounded-xl bg-beautiro-surface px-4 py-4 text-sm text-beautiro-charcoal">
            {t("resetSuccess")}
          </p>
          <Link
            href="/book?tab=account"
            className="mt-4 inline-flex h-11 items-center rounded-xl bg-beautiro-primary px-5 text-sm font-semibold text-white"
          >
            {t("loginButton")}
          </Link>
        </div>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 grid gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            required
            minLength={8}
            className={inputClass}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={t("confirmPasswordPlaceholder")}
            required
            minLength={8}
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
            {submitting ? t("submitting") : t("resetButton")}
          </button>
        </form>
      )}
    </div>
  );
}
