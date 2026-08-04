"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { trackReviewSubmit } from "@/lib/analytics";
import type { Locale } from "@/i18n/routing";

const inputClass =
  "w-full rounded-xl border border-beautiro-border bg-white px-4 py-3 text-sm text-beautiro-charcoal outline-none transition-colors placeholder:text-beautiro-muted-light focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10";

export function ReviewForm() {
  const t = useTranslations("reviews");
  const locale = useLocale() as Locale;
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    hospitalName: "",
    procedureName: "",
    reviewText: "",
    instagramHandle: "",
    visitMonth: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          ...form,
          guestPhone: form.guestPhone || undefined,
          hospitalName: form.hospitalName || undefined,
          instagramHandle: form.instagramHandle || undefined,
          visitMonth: form.visitMonth || undefined,
          rating,
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      trackReviewSubmit();
      setReferenceId(data.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (referenceId) {
    return (
      <div className="card-modern mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-beautiro-primary/10 text-beautiro-primary">
          <CheckCircle2 size={28} strokeWidth={1.5} />
        </div>
        <p className="text-label mt-6 text-beautiro-primary">{t("reference")}</p>
        <p className="mt-2 font-mono text-sm text-beautiro-muted">{referenceId}</p>
        <h2 className="font-display mt-6 text-xl font-semibold text-beautiro-charcoal">
          {t("successTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-beautiro-muted">
          {t("successBody")}
        </p>
        <ul className="mt-6 space-y-2 text-left text-sm text-beautiro-muted">
          {(t.raw("rewardItems") as string[]).map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-beautiro-primary" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href="/book"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-beautiro-primary px-6 text-sm font-semibold text-white hover:bg-beautiro-primary-hover"
        >
          {t("bookCta")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="card-modern mx-auto max-w-2xl p-6 sm:p-8">
      <div>
        <p className="text-label text-beautiro-primary">{t("eyebrow")}</p>
        <h1 className="font-display mt-1 text-2xl font-semibold text-beautiro-charcoal">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-beautiro-muted">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-beautiro-primary/20 bg-beautiro-primary/5 p-4">
        <p className="text-sm font-semibold text-beautiro-charcoal">{t("rewardTitle")}</p>
        <ul className="mt-2 space-y-1 text-sm text-beautiro-muted">
          {(t.raw("rewardItems") as string[]).map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <label className="text-xs font-medium text-beautiro-charcoal">
          {t("rating")} <span className="text-beautiro-primary">*</span>
        </label>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="rounded-lg p-1 transition-colors hover:bg-beautiro-surface"
              aria-label={`${value}`}
            >
              <Star
                size={24}
                className={
                  value <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-beautiro-border"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label={t("name")} required>
          <input
            className={inputClass}
            required
            value={form.guestName}
            onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))}
          />
        </Field>
        <Field label={t("email")} required>
          <input
            type="email"
            className={inputClass}
            required
            value={form.guestEmail}
            onChange={(e) => setForm((f) => ({ ...f, guestEmail: e.target.value }))}
          />
        </Field>
        <Field label={t("phone")}>
          <input
            type="tel"
            className={inputClass}
            value={form.guestPhone}
            onChange={(e) => setForm((f) => ({ ...f, guestPhone: e.target.value }))}
          />
        </Field>
        <Field label={t("instagram")}>
          <input
            className={inputClass}
            placeholder="@beautiro.official"
            value={form.instagramHandle}
            onChange={(e) =>
              setForm((f) => ({ ...f, instagramHandle: e.target.value }))
            }
          />
        </Field>
        <Field label={t("procedure")} required className="sm:col-span-2">
          <input
            className={inputClass}
            required
            placeholder={t("procedurePlaceholder")}
            value={form.procedureName}
            onChange={(e) =>
              setForm((f) => ({ ...f, procedureName: e.target.value }))
            }
          />
        </Field>
        <Field label={t("hospital")} className="sm:col-span-2">
          <input
            className={inputClass}
            value={form.hospitalName}
            onChange={(e) =>
              setForm((f) => ({ ...f, hospitalName: e.target.value }))
            }
          />
        </Field>
        <Field label={t("visitMonth")} className="sm:col-span-2">
          <input
            type="month"
            className={inputClass}
            value={form.visitMonth}
            onChange={(e) => setForm((f) => ({ ...f, visitMonth: e.target.value }))}
          />
        </Field>
        <Field label={t("reviewText")} required className="sm:col-span-2">
          <textarea
            className={`${inputClass} min-h-[120px] resize-y`}
            required
            minLength={20}
            placeholder={t("reviewPlaceholder")}
            value={form.reviewText}
            onChange={(e) => setForm((f) => ({ ...f, reviewText: e.target.value }))}
          />
        </Field>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs text-beautiro-muted">{t("privacyNote")}</p>

      <Button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full sm:w-auto"
      >
        {submitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

function Field({
  label,
  children,
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-medium text-beautiro-charcoal">
        {label}
        {required && <span className="text-beautiro-primary"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
