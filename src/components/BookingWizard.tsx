"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";
import type { MedicalCategory } from "@prisma/client";

export type ProcedureOption = {
  id: string;
  name: string;
  category: MedicalCategory;
  hospitalName: string;
};

type FormState = {
  procedureId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  arrivalDate: string;
  preferredDate: string;
  notes: string;
  van: boolean;
  interpreter: boolean;
  fx: boolean;
};

export function BookingWizard({
  procedures,
}: {
  procedures: ProcedureOption[];
}) {
  const t = useTranslations("book");
  const tSteps = useTranslations("steps");
  const tCat = useTranslations("hospitals.categories");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const preselected = searchParams.get("procedure") ?? "";

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    procedureId: preselected,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    arrivalDate: "",
    preferredDate: "",
    notes: "",
    van: true,
    interpreter: true,
    fx: true,
  });

  const stepLabels = useMemo(
    () => [tSteps("step1"), tSteps("step2"), tSteps("step3")],
    [tSteps],
  );

  const selectedProcedure = procedures.find((p) => p.id === form.procedureId);

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
          preferredDate: form.preferredDate || undefined,
          notes: form.notes || undefined,
          services: {
            van: form.van,
            interpreter: form.interpreter,
            fx: form.fx,
          },
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
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
      <div className="border border-beautiro-border bg-beautiro-surface px-8 py-14 text-center sm:px-12">
        <p className="text-label-wide text-beautiro-primary">
          {t("reference")}
        </p>
        <p className="mt-4 font-mono text-sm text-beautiro-muted">{referenceId}</p>
        <h2 className="mt-8 text-3xl font-bold text-beautiro-charcoal">
          {t("successTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-beautiro-muted">
          {t("successBody")}
        </p>
        <Button
          variant="secondary"
          className="mt-10"
          onClick={() => {
            setReferenceId(null);
            setStep(1);
            setForm((f) => ({
              ...f,
              guestName: "",
              guestEmail: "",
              guestPhone: "",
              notes: "",
            }));
          }}
        >
          {t("another")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
      <aside className="hidden lg:block">
        <StepIndicator
          current={step}
          labels={stepLabels}
          layout="vertical"
        />
      </aside>

      <div className="min-w-0">
        <div className="lg:hidden">
          <StepIndicator current={step} labels={stepLabels} layout="horizontal" />
        </div>

        <p className="mt-2 text-xs text-beautiro-muted lg:mt-0">
          {t("stepLabel", { current: step, total: 3 })}
        </p>

        {step === 1 && (
          <div className="mt-8 space-y-3">
            <h2 className="sr-only">{t("step1Title")}</h2>
            <ChoiceCard
              name="procedure"
              checked={!form.procedureId}
              onSelect={() => setForm((f) => ({ ...f, procedureId: "" }))}
              title={t("noProcedure")}
            />
            {procedures.map((p) => (
              <ChoiceCard
                key={p.id}
                name="procedure"
                checked={form.procedureId === p.id}
                onSelect={() =>
                  setForm((f) => ({ ...f, procedureId: p.id }))
                }
                title={p.name}
                meta={p.hospitalName}
                badge={tCat(p.category)}
              />
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <h2 className="sr-only">{t("step2Title")}</h2>
            <Field label={t("name")} required className="sm:col-span-2">
              <input
                className={inputClass}
                autoComplete="name"
                value={form.guestName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guestName: e.target.value }))
                }
              />
            </Field>
            <Field label={t("email")} required>
              <input
                type="email"
                autoComplete="email"
                className={inputClass}
                value={form.guestEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guestEmail: e.target.value }))
                }
              />
            </Field>
            <Field label={t("phone")} required>
              <input
                type="tel"
                autoComplete="tel"
                className={inputClass}
                value={form.guestPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guestPhone: e.target.value }))
                }
              />
            </Field>
            <Field label={t("arrival")}>
              <input
                type="date"
                className={inputClass}
                value={form.arrivalDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, arrivalDate: e.target.value }))
                }
              />
            </Field>
            <Field label={t("preferred")}>
              <input
                type="date"
                className={inputClass}
                value={form.preferredDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, preferredDate: e.target.value }))
                }
              />
            </Field>
            <Field label={t("notes")} className="sm:col-span-2">
              <textarea
                className={`${inputClass} min-h-[120px] resize-y`}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-4">
            <h2 className="sr-only">{t("step3Title")}</h2>
            <ServiceToggle
              label={t("van")}
              checked={form.van}
              onChange={(van) => setForm((f) => ({ ...f, van }))}
            />
            <ServiceToggle
              label={t("interpreter")}
              checked={form.interpreter}
              onChange={(interpreter) => setForm((f) => ({ ...f, interpreter }))}
            />
            <ServiceToggle
              label={t("fx")}
              checked={form.fx}
              onChange={(fx) => setForm((f) => ({ ...f, fx }))}
            />
            <SummaryPanel
              procedure={selectedProcedure}
              form={form}
              noProcedureLabel={t("noProcedure")}
              serviceLabels={{
                van: t("van"),
                interpreter: t("interpreter"),
                fx: t("fx"),
              }}
              previewLabel={t("preview")}
            />
          </div>
        )}

        {error && (
          <p className="mt-6 text-sm text-red-800/90" role="alert">
            {error}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-beautiro-border pt-8">
          <Button
            variant="ghost"
            disabled={step === 1 || submitting}
            onClick={() => setStep((s) => s - 1)}
            className="disabled:opacity-30"
          >
            {t("back")}
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => {
                if (step === 2 && !canProceedStep2(form)) return;
                setStep((s) => s + 1);
              }}
              disabled={step === 2 && !canProceedStep2(form)}
              className="disabled:opacity-40"
            >
              {t("next")}
            </Button>
          ) : (
            <Button
              disabled={submitting || !canProceedStep2(form)}
              onClick={() => void handleSubmit()}
              className="disabled:opacity-40"
            >
              {submitting ? t("submitting") : t("submit")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full border border-beautiro-border bg-beautiro-surface px-4 py-3 text-sm text-beautiro-charcoal outline-none transition-colors placeholder:text-beautiro-muted/60 focus:border-beautiro-charcoal focus:ring-1 focus:ring-beautiro-charcoal/20";

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
      <span className="text-label text-beautiro-muted">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function ChoiceCard({
  name,
  checked,
  onSelect,
  title,
  meta,
  badge,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  meta?: string;
  badge?: string;
}) {
  return (
    <label
      className={`block cursor-pointer border px-5 py-4 transition-colors ${
        checked
          ? "border-beautiro-charcoal bg-beautiro-surface shadow-[inset_3px_0_0_0_var(--beautiro-charcoal)]"
          : "border-beautiro-border bg-background hover:border-beautiro-muted/40"
      }`}
    >
      <input
        type="radio"
        name={name}
        className="sr-only"
        checked={checked}
        onChange={onSelect}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          {badge && (
            <span className="text-label text-beautiro-primary">
              {badge}
            </span>
          )}
          <span className="mt-1 block text-sm font-medium text-beautiro-charcoal">
            {title}
          </span>
          {meta && (
            <span className="mt-1 block text-xs text-beautiro-muted">{meta}</span>
          )}
        </div>
        <span
          className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
            checked
              ? "border-beautiro-charcoal bg-beautiro-charcoal"
              : "border-beautiro-border"
          }`}
        />
      </div>
    </label>
  );
}

function ServiceToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border border-beautiro-border bg-background px-5 py-4">
      <span className="text-sm font-medium text-beautiro-charcoal">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 transition-colors ${
          checked ? "bg-beautiro-charcoal" : "bg-beautiro-border"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 bg-beautiro-surface shadow-sm transition-transform ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function SummaryPanel({
  procedure,
  form,
  noProcedureLabel,
  serviceLabels,
  previewLabel,
}: {
  procedure?: ProcedureOption;
  form: FormState;
  noProcedureLabel: string;
  serviceLabels: { van: string; interpreter: string; fx: string };
  previewLabel: string;
}) {
  const services = [
    form.van && serviceLabels.van,
    form.interpreter && serviceLabels.interpreter,
    form.fx && serviceLabels.fx,
  ].filter(Boolean);

  if (!procedure && services.length === 0) return null;

  return (
    <div className="mt-6 border-t border-beautiro-border pt-6 text-xs text-beautiro-muted">
      <p className="text-label text-beautiro-muted">{previewLabel}</p>
      <p className="mt-2 text-sm text-beautiro-charcoal">
        {procedure?.name ?? noProcedureLabel}
      </p>
      {services.length > 0 && (
        <p className="mt-1">{services.join(" · ")}</p>
      )}
    </div>
  );
}

function canProceedStep2(form: FormState) {
  return (
    form.guestName.trim().length > 1 &&
    form.guestEmail.includes("@") &&
    form.guestPhone.trim().length > 5
  );
}
