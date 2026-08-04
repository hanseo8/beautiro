"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Car,
  CheckCircle2,
  Languages,
  MessageCircle,
  Wallet,
} from "lucide-react";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/Button";
import type { ProcedureOption } from "@/components/BookingWizard";
import { trackBookingComplete } from "@/lib/analytics";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/routing";

type FormState = {
  preferredDate: string;
  arrivalDate: string;
  van: boolean;
  interpreter: boolean;
  fx: boolean;
  procedureId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes: string;
};

const inputClass =
  "w-full rounded-xl border border-beautiro-border bg-white px-4 py-3 text-sm text-beautiro-charcoal outline-none transition-colors placeholder:text-beautiro-muted-light focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10";

function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(base: string, offset: number) {
  const d = new Date(`${base}T12:00:00`);
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatChipLabel(dateStr: string, locale: Locale) {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString(locale === "ko" ? "ko-KR" : locale === "id" ? "id-ID" : "en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

export function OnlineBookingFlow({
  procedures,
  onComplete,
}: {
  procedures: ProcedureOption[];
  onComplete?: (referenceId: string) => void;
}) {
  const t = useTranslations("book.onlineBooking");
  const tBook = useTranslations("book");
  const locale = useLocale() as Locale;
  const minDate = todayString();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    preferredDate: "",
    arrivalDate: "",
    van: false,
    interpreter: false,
    fx: false,
    procedureId: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    notes: "",
  });

  const stepLabels = useMemo(
    () => [t("step1Label"), t("step2Label"), t("step3Label")],
    [t],
  );

  const dateOptions = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(minDate, i)),
    [minDate],
  );

  const selectedProcedure = procedures.find((p) => p.id === form.procedureId);
  const wa = whatsappUrl(consultMessage({ locale }));

  const selectedServices = [
    form.van && tBook("van"),
    form.interpreter && tBook("interpreter"),
    form.fx && tBook("fx"),
  ].filter((s): s is string => Boolean(s));

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          procedureId: form.procedureId || undefined,
          guestName: form.guestName,
          guestEmail: form.guestEmail,
          guestPhone: form.guestPhone,
          arrivalDate: form.arrivalDate || undefined,
          preferredDate: form.preferredDate,
          notes: form.notes || undefined,
          services: {
            van: form.van,
            interpreter: form.interpreter,
            fx: form.fx,
          },
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      if (data.id) {
        trackBookingComplete(data.id);
        onComplete?.(data.id);
      }
      setReferenceId(data.id ?? null);
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 4 && referenceId) {
    return (
      <div className="py-4 text-center sm:py-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-beautiro-primary/10 text-beautiro-primary">
          <CheckCircle2 size={28} strokeWidth={1.5} />
        </div>
        <p className="text-label mt-6 text-beautiro-primary">{tBook("reference")}</p>
        <p className="mt-2 font-mono text-sm text-beautiro-muted">{referenceId}</p>
        <h2 className="font-display mt-6 text-xl font-semibold text-beautiro-charcoal">
          {t("successTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-beautiro-muted">
          {t("successBody")}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setReferenceId(null);
              setStep(1);
              setForm({
                preferredDate: "",
                arrivalDate: "",
                van: false,
                interpreter: false,
                fx: false,
                procedureId: "",
                guestName: "",
                guestEmail: "",
                guestPhone: "",
                notes: "",
              });
            }}
          >
            {tBook("another")}
          </Button>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-beautiro-primary px-5 text-sm font-semibold text-white hover:bg-beautiro-primary-hover"
          >
            <MessageCircle size={16} />
            {tBook("whatsappFollowUp")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator current={step} labels={stepLabels} layout="horizontal" />

      <div className="mt-6 border-b border-beautiro-border pb-5">
        <p className="text-label text-beautiro-primary">
          {tBook("stepLabel", { current: step, total: 3 })}
        </p>
        <h2 className="font-display mt-1 text-xl font-semibold tracking-tight text-beautiro-charcoal">
          {step === 1 ? t("step1Title") : step === 2 ? t("step2Title") : t("step3Title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-beautiro-muted">
          {step === 1 ? t("step1Desc") : step === 2 ? t("step2Desc") : t("step3Desc")}
        </p>
      </div>

      {step === 1 && (
        <div className="mt-6 space-y-5">
          <section>
            <h3 className="text-sm font-semibold text-beautiro-charcoal">
              {t("preferredDateTitle")}
              <span className="text-beautiro-primary"> *</span>
            </h3>
            <p className="mt-1 text-xs text-beautiro-muted">{t("preferredDateDesc")}</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {dateOptions.map((dateStr) => {
                const active = form.preferredDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, preferredDate: dateStr }))}
                    className={`shrink-0 rounded-xl border px-3 py-2 text-left transition-colors ${
                      active
                        ? "border-beautiro-primary bg-beautiro-primary/5 text-beautiro-primary"
                        : "border-beautiro-border bg-white text-beautiro-charcoal hover:border-beautiro-primary/30"
                    }`}
                  >
                    <span className="block text-[10px] font-medium uppercase tracking-wide text-beautiro-muted">
                      {dateStr === minDate ? t("today") : ""}
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold">
                      {formatChipLabel(dateStr, locale)}
                    </span>
                  </button>
                );
              })}
            </div>
            <label className="mt-4 block">
              <span className="text-xs font-medium text-beautiro-charcoal">
                {tBook("preferred")}
              </span>
              <input
                type="date"
                min={minDate}
                className={`${inputClass} mt-1.5`}
                value={form.preferredDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, preferredDate: e.target.value }))
                }
              />
            </label>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-beautiro-charcoal">
              {tBook("arrival")}
            </h3>
            <p className="mt-1 text-xs text-beautiro-muted">{t("arrivalDesc")}</p>
            <input
              type="date"
              min={minDate}
              className={`${inputClass} mt-3`}
              value={form.arrivalDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, arrivalDate: e.target.value }))
              }
            />
          </section>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-3">
          <ServiceToggle
            icon={Car}
            label={tBook("van")}
            description={tBook("vanDesc")}
            checked={form.van}
            onChange={(van) => setForm((f) => ({ ...f, van }))}
          />
          <ServiceToggle
            icon={Languages}
            label={tBook("interpreter")}
            description={tBook("interpreterDesc")}
            checked={form.interpreter}
            onChange={(interpreter) => setForm((f) => ({ ...f, interpreter }))}
          />
          <ServiceToggle
            icon={Wallet}
            label={tBook("fx")}
            description={tBook("fxDesc")}
            checked={form.fx}
            onChange={(fx) => setForm((f) => ({ ...f, fx }))}
          />
          {!hasSelectedService(form) && (
            <p className="text-xs text-beautiro-muted">{t("serviceRequired")}</p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-beautiro-border bg-beautiro-surface/50 p-4 text-sm">
            <div className="flex items-start gap-2 text-beautiro-charcoal">
              <CalendarDays size={16} className="mt-0.5 shrink-0 text-beautiro-primary" />
              <div>
                <p className="font-semibold">{formatChipLabel(form.preferredDate, locale)}</p>
                <p className="mt-1 text-xs text-beautiro-muted">
                  {selectedServices.join(" · ")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="block">
              <span className="text-xs font-medium text-beautiro-charcoal">
                {tBook("name")} <span className="text-beautiro-primary">*</span>
              </span>
              <input
                className={`${inputClass} mt-1.5`}
                autoComplete="name"
                placeholder={tBook("namePlaceholder")}
                value={form.guestName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guestName: e.target.value }))
                }
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-beautiro-charcoal">
                {tBook("email")} <span className="text-beautiro-primary">*</span>
              </span>
              <input
                type="email"
                className={`${inputClass} mt-1.5`}
                autoComplete="email"
                placeholder={tBook("emailPlaceholder")}
                value={form.guestEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guestEmail: e.target.value }))
                }
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-beautiro-charcoal">
                {tBook("phone")} <span className="text-beautiro-primary">*</span>
              </span>
              <input
                type="tel"
                className={`${inputClass} mt-1.5`}
                autoComplete="tel"
                placeholder={tBook("phonePlaceholder")}
                value={form.guestPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guestPhone: e.target.value }))
                }
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-beautiro-charcoal">
                {t("procedureOptional")}
              </span>
              <select
                className={`${inputClass} mt-1.5`}
                value={form.procedureId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, procedureId: e.target.value }))
                }
              >
                <option value="">{tBook("noProcedure")}</option>
                {procedures.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.hospitalName}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-beautiro-charcoal">
                {tBook("notes")}
              </span>
              <textarea
                className={`${inputClass} mt-1.5 min-h-[88px] resize-y`}
                placeholder={tBook("notesPlaceholder")}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </label>
          </div>

          {selectedProcedure && (
            <p className="text-xs text-beautiro-muted">
              {selectedProcedure.name} · {selectedProcedure.hospitalName}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-beautiro-border pt-6">
        <Button
          variant="ghost"
          disabled={step === 1 || submitting}
          onClick={() => setStep((s) => s - 1)}
          className="disabled:opacity-30"
        >
          {tBook("back")}
        </Button>
        {step < 3 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={
              (step === 1 && !form.preferredDate) ||
              (step === 2 && !hasSelectedService(form))
            }
            className="min-w-[7rem] disabled:opacity-40"
          >
            {tBook("next")}
          </Button>
        ) : (
          <Button
            disabled={submitting || !canSubmitContact(form)}
            onClick={() => void handleSubmit()}
            className="min-w-[7rem] disabled:opacity-40"
          >
            {submitting ? tBook("submitting") : t("submit")}
          </Button>
        )}
      </div>
    </div>
  );
}

function hasSelectedService(form: FormState) {
  return form.van || form.interpreter || form.fx;
}

function canSubmitContact(form: FormState) {
  return (
    form.guestName.trim().length > 1 &&
    form.guestEmail.includes("@") &&
    form.guestPhone.trim().length > 5
  );
}

function ServiceToggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: typeof Car;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all ${
        checked
          ? "border-beautiro-primary bg-beautiro-primary/5"
          : "border-beautiro-border bg-white hover:border-beautiro-primary/25"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
          checked
            ? "border-beautiro-primary/20 bg-white text-beautiro-primary"
            : "border-beautiro-border bg-beautiro-surface text-beautiro-muted"
        }`}
      >
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-beautiro-charcoal">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-beautiro-muted">{description}</p>
      </div>
      <span
        className={`mt-1 flex h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${
          checked ? "bg-beautiro-primary" : "bg-beautiro-border"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
