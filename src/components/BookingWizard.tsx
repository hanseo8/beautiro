"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Car,
  CheckCircle2,
  Languages,
  MapPin,
  MessageCircle,
  Search,
  Wallet,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { MEDICAL_CATEGORIES } from "@/lib/regions";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/routing";
import { trackBookingComplete } from "@/lib/analytics";
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

type CategoryFilter = MedicalCategory | "ALL";

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
  const tab = searchParams.get("tab");
  const preselected = searchParams.get("procedure") ?? "";

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    let cancelled = false;
    async function prefillFromSession() {
      try {
        const res = await fetch("/api/auth/me");
        const data = (await res.json()) as {
          user?: { name: string; email: string; phone: string | null } | null;
        };
        if (cancelled || !data.user) return;
        setForm((prev) => ({
          ...prev,
          guestName: prev.guestName || data.user!.name,
          guestEmail: prev.guestEmail || data.user!.email,
          guestPhone: prev.guestPhone || data.user!.phone || "",
        }));
      } catch {
        // ignore
      }
    }
    void prefillFromSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const stepLabels = useMemo(
    () => [tSteps("step1"), tSteps("step2"), tSteps("step3")],
    [tSteps],
  );

  const stepDescriptions = useMemo(
    () => [t("step1Desc"), t("step2Desc"), t("step3Desc")],
    [t],
  );

  const selectedProcedure = procedures.find((p) => p.id === form.procedureId);
  const wa = whatsappUrl(consultMessage({ locale }));

  const filteredProcedures = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return procedures.filter((p) => {
      if (categoryFilter !== "ALL" && p.category !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.hospitalName.toLowerCase().includes(q) ||
        tCat(p.category).toLowerCase().includes(q)
      );
    });
  }, [procedures, categoryFilter, searchQuery, tCat]);

  if (tab === "account") {
    return <AuthPanel wa={wa} />;
  }

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
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      if (data.id) trackBookingComplete(data.id);
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
      <div className="mx-auto max-w-lg py-6 text-center sm:py-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-beautiro-primary/10 text-beautiro-primary">
          <CheckCircle2 size={28} strokeWidth={1.5} />
        </div>
        <p className="text-label mt-6 text-beautiro-primary">{t("reference")}</p>
        <p className="mt-2 font-mono text-sm text-beautiro-muted">{referenceId}</p>
        <h2 className="font-display mt-6 text-2xl font-semibold text-beautiro-charcoal">
          {t("successTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-beautiro-muted">
          {t("successBody")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="secondary"
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
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-beautiro-primary px-5 text-sm font-semibold text-white hover:bg-beautiro-primary-hover"
          >
            <MessageCircle size={16} />
            {t("whatsappFollowUp")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:block">
        <StepIndicator
          current={step}
          labels={stepLabels}
          descriptions={stepDescriptions}
          layout="vertical"
        />
        <div className="mt-8 rounded-xl border border-beautiro-border bg-beautiro-surface/60 p-4">
          <p className="text-xs font-semibold text-beautiro-charcoal">
            {t("trustTitle")}
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-beautiro-muted">
            <li>{t("trustResponse")}</li>
            <li>{t("trustPrivate")}</li>
          </ul>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="lg:hidden">
          <StepIndicator
            current={step}
            labels={stepLabels}
            layout="horizontal"
          />
        </div>

        <StepHeader
          step={step}
          title={
            step === 1
              ? t("step1Title")
              : step === 2
                ? t("step2Title")
                : t("step3Title")
          }
          description={stepDescriptions[step - 1]}
          stepLabel={t("stepLabel", { current: step, total: 3 })}
        />

        {step === 1 && (
          <div className="mt-6 space-y-5">
            <GeneralConsultCard
              checked={!form.procedureId}
              onSelect={() => setForm((f) => ({ ...f, procedureId: "" }))}
              title={t("noProcedure")}
              description={t("noProcedureDesc")}
              badge={t("recommended")}
            />

            <div>
              <p className="text-label text-beautiro-muted">
                {t("selectProcedure")}
              </p>
              <div className="relative mt-3">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-beautiro-muted"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("searchProcedure")}
                  className={inputClass + " pl-10"}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <FilterPill
                  active={categoryFilter === "ALL"}
                  onClick={() => setCategoryFilter("ALL")}
                  label={t("filterAll")}
                />
                {MEDICAL_CATEGORIES.map((cat) => (
                  <FilterPill
                    key={cat}
                    active={categoryFilter === cat}
                    onClick={() => setCategoryFilter(cat)}
                    label={tCat(cat)}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {filteredProcedures.length === 0 ? (
                <p className="col-span-full rounded-xl bg-beautiro-surface py-10 text-center text-sm text-beautiro-muted">
                  {t("noResults")}
                </p>
              ) : (
                filteredProcedures.map((p) => (
                  <ProcedureCard
                    key={p.id}
                    checked={form.procedureId === p.id}
                    onSelect={() =>
                      setForm((f) => ({ ...f, procedureId: p.id }))
                    }
                    title={p.name}
                    hospital={p.hospitalName}
                    badge={tCat(p.category)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-8">
            <section>
              <h3 className="text-sm font-semibold text-beautiro-charcoal">
                {t("contactSection")}
              </h3>
              <p className="mt-1 text-xs text-beautiro-muted">
                {t("contactSectionDesc")}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label={t("name")} required className="sm:col-span-2">
                  <input
                    className={inputClass}
                    autoComplete="name"
                    placeholder={t("namePlaceholder")}
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
                    placeholder={t("emailPlaceholder")}
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
                    placeholder={t("phonePlaceholder")}
                    value={form.guestPhone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, guestPhone: e.target.value }))
                    }
                  />
                </Field>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-beautiro-charcoal">
                {t("scheduleSection")}
              </h3>
              <p className="mt-1 text-xs text-beautiro-muted">
                {t("scheduleSectionDesc")}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                    className={`${inputClass} min-h-[100px] resize-y`}
                    placeholder={t("notesPlaceholder")}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                  />
                </Field>
              </div>
            </section>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="space-y-3">
              <ServiceCard
                icon={Car}
                label={t("van")}
                description={t("vanDesc")}
                checked={form.van}
                onChange={(van) => setForm((f) => ({ ...f, van }))}
              />
              <ServiceCard
                icon={Languages}
                label={t("interpreter")}
                description={t("interpreterDesc")}
                checked={form.interpreter}
                onChange={(interpreter) =>
                  setForm((f) => ({ ...f, interpreter }))
                }
              />
              <ServiceCard
                icon={Wallet}
                label={t("fx")}
                description={t("fxDesc")}
                checked={form.fx}
                onChange={(fx) => setForm((f) => ({ ...f, fx }))}
              />
            </div>
            <SummaryCard
              procedure={selectedProcedure}
              form={form}
              noProcedureLabel={t("noProcedure")}
              serviceLabels={{
                van: t("van"),
                interpreter: t("interpreter"),
                fx: t("fx"),
              }}
              previewLabel={t("preview")}
              servicesLabel={t("servicesLabel")}
              nameLabel={t("name")}
              contactLabel={t("phone")}
            />
          </div>
        )}

        {error && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}

        <WizardFooter
          step={step}
          submitting={submitting}
          canProceed={canProceedStep2(form)}
          onBack={() => setStep((s) => s - 1)}
          onNext={() => {
            if (step === 2 && !canProceedStep2(form)) return;
            setStep((s) => s + 1);
          }}
          onSubmit={() => void handleSubmit()}
          backLabel={t("back")}
          nextLabel={t("next")}
          submitLabel={submitting ? t("submitting") : t("submit")}
        />
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-beautiro-border bg-white px-4 py-3 text-sm text-beautiro-charcoal outline-none transition-colors placeholder:text-beautiro-muted-light focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10";

function StepHeader({
  step,
  title,
  description,
  stepLabel,
}: {
  step: number;
  title: string;
  description: string;
  stepLabel: string;
}) {
  return (
    <div className="border-b border-beautiro-border pb-5">
      <p className="text-label text-beautiro-primary">{stepLabel}</p>
      <h2 className="font-display mt-1 text-xl font-semibold tracking-tight text-beautiro-charcoal sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-beautiro-muted">
        {description}
      </p>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-beautiro-primary text-white"
          : "bg-beautiro-surface text-beautiro-muted hover:bg-beautiro-primary/10 hover:text-beautiro-primary"
      }`}
    >
      {label}
    </button>
  );
}

function GeneralConsultCard({
  checked,
  onSelect,
  title,
  description,
  badge,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <label
      className={`block cursor-pointer rounded-xl border-2 p-5 transition-all ${
        checked
          ? "border-beautiro-primary bg-beautiro-primary/5 shadow-sm"
          : "border-beautiro-border bg-white hover:border-beautiro-primary/30"
      }`}
    >
      <input
        type="radio"
        name="procedure"
        className="sr-only"
        checked={checked}
        onChange={onSelect}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-label text-beautiro-primary">{badge}</span>
          <p className="mt-1 text-base font-semibold text-beautiro-charcoal">
            {title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-beautiro-muted">
            {description}
          </p>
        </div>
        <RadioMark checked={checked} />
      </div>
    </label>
  );
}

function ProcedureCard({
  checked,
  onSelect,
  title,
  hospital,
  badge,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  hospital: string;
  badge: string;
}) {
  return (
    <label
      className={`block h-full cursor-pointer rounded-xl border p-4 transition-all ${
        checked
          ? "border-beautiro-primary bg-beautiro-primary/5 ring-1 ring-beautiro-primary/20"
          : "border-beautiro-border bg-white hover:border-beautiro-primary/25"
      }`}
    >
      <input
        type="radio"
        name="procedure"
        className="sr-only"
        checked={checked}
        onChange={onSelect}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="inline-block rounded-md bg-beautiro-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-beautiro-primary">
            {badge}
          </span>
          <p className="mt-2 text-sm font-semibold leading-snug text-beautiro-charcoal">
            {title}
          </p>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-beautiro-muted">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{hospital}</span>
          </p>
        </div>
        <RadioMark checked={checked} />
      </div>
    </label>
  );
}

function RadioMark({ checked }: { checked: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        checked
          ? "border-beautiro-primary bg-beautiro-primary"
          : "border-beautiro-border bg-white"
      }`}
    >
      {checked && <span className="h-2 w-2 rounded-full bg-white" />}
    </span>
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

function ServiceCard({
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
  onChange: (v: boolean) => void;
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
        <p className="mt-0.5 text-xs leading-relaxed text-beautiro-muted">
          {description}
        </p>
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

function SummaryCard({
  procedure,
  form,
  noProcedureLabel,
  serviceLabels,
  previewLabel,
  servicesLabel,
  nameLabel,
  contactLabel,
}: {
  procedure?: ProcedureOption;
  form: FormState;
  noProcedureLabel: string;
  serviceLabels: { van: string; interpreter: string; fx: string };
  previewLabel: string;
  servicesLabel: string;
  nameLabel: string;
  contactLabel: string;
}) {
  const services: string[] = [
    form.van && serviceLabels.van,
    form.interpreter && serviceLabels.interpreter,
    form.fx && serviceLabels.fx,
  ].filter((s): s is string => Boolean(s));

  return (
    <div className="h-fit rounded-xl border border-beautiro-border bg-beautiro-surface/50 p-5 lg:sticky lg:top-28">
      <p className="text-label text-beautiro-primary">{previewLabel}</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs text-beautiro-muted">{previewLabel}</dt>
          <dd className="mt-0.5 font-medium text-beautiro-charcoal">
            {procedure?.name ?? noProcedureLabel}
          </dd>
          {procedure && (
            <dd className="mt-0.5 text-xs text-beautiro-muted">
              {procedure.hospitalName}
            </dd>
          )}
        </div>
        {form.guestName && (
          <div>
            <dt className="text-xs text-beautiro-muted">{nameLabel}</dt>
            <dd className="mt-0.5 font-medium text-beautiro-charcoal">
              {form.guestName}
            </dd>
          </div>
        )}
        {form.guestPhone && (
          <div>
            <dt className="text-xs text-beautiro-muted">{contactLabel}</dt>
            <dd className="mt-0.5 font-medium text-beautiro-charcoal">
              {form.guestPhone}
            </dd>
          </div>
        )}
        {services.length > 0 && (
          <div>
            <dt className="text-xs text-beautiro-muted">{servicesLabel}</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {services.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-beautiro-primary"
                >
                  {s}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function WizardFooter({
  step,
  submitting,
  canProceed,
  onBack,
  onNext,
  onSubmit,
  backLabel,
  nextLabel,
  submitLabel,
}: {
  step: number;
  submitting: boolean;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  backLabel: string;
  nextLabel: string;
  submitLabel: string;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-beautiro-border pt-6">
      <Button
        variant="ghost"
        disabled={step === 1 || submitting}
        onClick={onBack}
        className="disabled:opacity-30"
      >
        {backLabel}
      </Button>
      {step < 3 ? (
        <Button
          onClick={onNext}
          disabled={step === 2 && !canProceed}
          className="min-w-[7rem] disabled:opacity-40"
        >
          {nextLabel}
        </Button>
      ) : (
        <Button
          disabled={submitting || !canProceed}
          onClick={onSubmit}
          className="min-w-[7rem] disabled:opacity-40"
        >
          {submitLabel}
        </Button>
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
