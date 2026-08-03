"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, type ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  MEDICAL_CATEGORIES,
  PROVINCE_KEYS,
  districtsForProvince,
  isProvinceKey,
} from "@/lib/regions";
import type { FilterCounts } from "./types";

const selectClass =
  "h-11 w-full rounded-xl border border-beautiro-border bg-white px-3.5 text-sm text-beautiro-charcoal outline-none transition-colors focus:border-beautiro-primary focus:ring-2 focus:ring-beautiro-primary/15";

export function HospitalSearchPanel({
  counts,
  children,
}: {
  counts: FilterCounts;
  children: ReactNode;
}) {
  const t = useTranslations("hospitals");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      category: searchParams.get("category") ?? "",
      province: searchParams.get("province") ?? "",
      district: searchParams.get("district") ?? "",
    }),
    [searchParams],
  );

  const [draft, setDraft] = useState(current);

  useEffect(() => {
    setDraft(current);
  }, [current]);

  const province = isProvinceKey(draft.province) ? draft.province : undefined;
  const districts = province ? districtsForProvince(province) : [];

  function applyFilters(next = draft) {
    const params = new URLSearchParams();
    if (next.q.trim()) params.set("q", next.q.trim());
    if (next.category) params.set("category", next.category);
    if (next.province) params.set("province", next.province);
    if (next.district) params.set("district", next.district);
    const qs = params.toString();
    router.push(qs ? `/hospitals?${qs}` : "/hospitals");
    setMobileOpen(false);
  }

  function clearFilters() {
    setDraft({ q: "", category: "", province: "", district: "" });
    router.push("/hospitals");
    setMobileOpen(false);
  }

  const hasActive =
    current.q || current.category || current.province || current.district;

  const activeTags = [
    current.category && {
      key: "category",
      label: t(`categories.${current.category}`),
    },
    current.province &&
      isProvinceKey(current.province) && {
        key: "province",
        label: t(`regions.provinces.${current.province}`),
      },
    current.district && {
      key: "district",
      label: t(`regions.districts.${current.district}`),
    },
    current.q && { key: "q", label: `“${current.q}”` },
  ].filter(Boolean) as { key: string; label: string }[];

  const form = (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters();
      }}
    >
      <div>
        <label htmlFor="hospital-q" className="text-label text-beautiro-muted">
          {t("searchLabel")}
        </label>
        <div className="relative mt-2">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-beautiro-muted"
          />
          <input
            id="hospital-q"
            type="search"
            value={draft.q}
            onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
            placeholder={t("searchPlaceholder")}
            className={`${selectClass} pl-10`}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="hospital-category"
          className="text-label text-beautiro-muted"
        >
          {t("filterCategory")}
        </label>
        <select
          id="hospital-category"
          value={draft.category}
          onChange={(e) =>
            setDraft((d) => ({ ...d, category: e.target.value }))
          }
          className={`${selectClass} mt-2`}
        >
          <option value="">{t("filterAll")}</option>
          {MEDICAL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {t(`categories.${cat}`)} ({counts.byCategory[cat] ?? 0})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="hospital-province"
          className="text-label text-beautiro-muted"
        >
          {t("filterProvince")}
        </label>
        <select
          id="hospital-province"
          value={draft.province}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              province: e.target.value,
              district: "",
            }))
          }
          className={`${selectClass} mt-2`}
        >
          <option value="">{t("filterAllRegions")}</option>
          {PROVINCE_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(`regions.provinces.${key}`)} ({counts.byProvince[key] ?? 0})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="hospital-district"
          className="text-label text-beautiro-muted"
        >
          {t("filterDistrict")}
        </label>
        <select
          id="hospital-district"
          value={draft.district}
          disabled={!province}
          onChange={(e) =>
            setDraft((d) => ({ ...d, district: e.target.value }))
          }
          className={`${selectClass} mt-2 disabled:cursor-not-allowed disabled:bg-beautiro-surface disabled:text-beautiro-muted-light`}
        >
          <option value="">
            {province ? t("filterAllDistricts") : t("selectProvinceFirst")}
          </option>
          {districts.map((key) => (
            <option key={key} value={key}>
              {t(`regions.districts.${key}`)} ({counts.byDistrict[key] ?? 0})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <button
          type="submit"
          className="h-11 rounded-xl bg-beautiro-primary text-sm font-bold text-white transition-colors hover:bg-beautiro-primary-hover"
        >
          {t("applyFilters")}
        </button>
        {hasActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="h-10 text-sm font-semibold text-beautiro-muted hover:text-beautiro-primary"
          >
            {t("clearFilters")}
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setMobileOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl border border-beautiro-border bg-white px-4 py-3.5 text-left lg:hidden"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-beautiro-charcoal">
          <SlidersHorizontal size={18} className="text-beautiro-primary" />
          {t("filterTitle")}
        </span>
        <span className="text-xs text-beautiro-muted">
          {t("partnerCount", { count: counts.total })}
        </span>
      </button>

      <div className="mt-4 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside
          className={`rounded-2xl border border-beautiro-border bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:sticky lg:top-24 lg:self-start ${mobileOpen ? "block" : "hidden lg:block"}`}
        >
          <div className="mb-5 hidden border-b border-beautiro-border pb-4 lg:block">
            <p className="text-sm font-bold text-beautiro-charcoal">
              {t("filterTitle")}
            </p>
            <p className="mt-1 text-xs text-beautiro-muted">
              {t("partnerCount", { count: counts.total })}
            </p>
          </div>
          {form}
        </aside>

        <div className="min-w-0">
          {activeTags.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-beautiro-muted">
                {t("activeFilters")}
              </span>
              {activeTags.map((tag) => (
                <span
                  key={tag.key}
                  className="inline-flex items-center gap-1 rounded-lg bg-beautiro-surface px-2.5 py-1 text-xs font-medium text-beautiro-charcoal"
                >
                  {tag.label}
                </span>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-beautiro-primary hover:underline"
              >
                <X size={12} />
                {t("clearFilters")}
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
