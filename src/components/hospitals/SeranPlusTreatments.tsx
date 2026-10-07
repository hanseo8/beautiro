"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import catalog from "@/lib/seranplus-catalog.json";
import { treatmentLabel } from "@/lib/treatment-labels";
import type { LocalizedHospital } from "@/lib/hospitals";

export function SeranPlusTreatments({ procedures }: { procedures: LocalizedHospital["procedures"] }) {
  const t = useTranslations("seranplus");
  const locale = useLocale();
  const [group, setGroup] = useState("lifting");
  const [query, setQuery] = useState("");
  const groups = useMemo(() => catalog.groups.map(g => ({ ...g, treatments: g.items.flatMap(item => {
    const saved = procedures.find(p => p.id === item.key || [item.nameKo, item.nameEn, item.nameId, treatmentLabel(item, locale)].includes(p.name));
    return saved ? [{ id: saved.id, name: saved.name }] : [];
  }) })), [procedures, locale]);
  const visible = groups.filter(g => group === "all" || g.key === group).flatMap(g => g.treatments.map(p => ({ ...p, groupName: treatmentLabel(g, locale) }))).filter(p => `${p.name} ${p.groupName}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const count = groups.reduce((total, g) => total + g.treatments.length, 0);
  if (!count) return null;
  return (
    <section id="seranplus-treatments" aria-labelledby="seranplus-treatments-title" className="min-w-0 rounded-xl border border-beautiro-border bg-white p-4 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-label text-beautiro-primary">Seran Plus Plastic Surgery</p>
          <h2 id="seranplus-treatments-title" className="mt-2 text-xl font-semibold text-beautiro-charcoal">{t("title")}</h2>
          <p className="mt-2 text-sm leading-6 text-beautiro-muted">{t("intro", { count })}</p>
        </div>
        <Link href="/hospitals/seran-plus" className="inline-flex items-center gap-1 text-sm font-semibold text-beautiro-primary">{t("profile")}<ArrowUpRight size={16} aria-hidden /></Link>
      </div>
      <div className="mt-5 flex flex-wrap gap-2" aria-label={t("groupLabel")}>
        {[{ key: "all", label: t("all"), count }, ...groups.map(g => ({ key: g.key, label: treatmentLabel(g, locale), count: g.treatments.length }))].map(item => (
          <button key={item.key} type="button" aria-pressed={group === item.key} onClick={() => setGroup(item.key)} className={`max-w-full rounded-md border px-3 py-2 text-left text-xs font-medium transition-colors ${group === item.key ? "border-beautiro-primary bg-beautiro-primary text-white" : "border-beautiro-border text-beautiro-muted hover:border-beautiro-primary"}`}>
            {item.label} <span className="ml-1 opacity-70">{item.count}</span>
          </button>
        ))}
      </div>
      <label className="relative mt-5 block" htmlFor="seranplus-treatment-search">
        <span className="sr-only">{t("search")}</span>
        <Search className="absolute left-3 top-3.5 text-beautiro-muted" size={16} aria-hidden />
        <input id="seranplus-treatment-search" type="search" value={query} onChange={e => { setQuery(e.target.value); if (e.target.value) setGroup("all"); }} placeholder={t("search")} className="w-full min-w-0 rounded-md border border-beautiro-border bg-white py-3 pl-10 pr-3 text-base outline-none focus:ring-2 focus:ring-beautiro-primary sm:text-sm" />
      </label>
      <p className="mt-3 text-xs text-beautiro-muted" aria-live="polite">{t("results", { count: visible.length })}</p>
      <ul className="mt-3 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
        {visible.map(item => <li key={item.id} className="min-w-0 rounded-lg border border-beautiro-border p-4">
          <p className="text-[11px] text-beautiro-muted">{item.groupName}</p>
          <Link href={`/events/${item.id}`} className="mt-1 block break-words text-sm font-semibold text-beautiro-charcoal hover:text-beautiro-primary">{item.name}</Link>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold">
            <Link href={`/events/${item.id}`} className="text-beautiro-muted hover:text-beautiro-primary">{t("details")}</Link>
            <Link href={`/book?tab=bookings&procedure=${encodeURIComponent(item.id)}`} className="inline-flex items-center gap-1 text-beautiro-primary">{t("book")}<ArrowUpRight size={14} aria-hidden /></Link>
          </div>
        </li>)}
      </ul>
      {visible.length === 0 && <p className="py-8 text-center text-sm text-beautiro-muted">{t("empty")}</p>}
      <p className="mt-5 border-t border-beautiro-border pt-4 text-xs leading-6 text-beautiro-muted">{t("note")}</p>
    </section>
  );
}
