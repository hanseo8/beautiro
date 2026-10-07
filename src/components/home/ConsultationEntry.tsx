"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TrackedWhatsAppLink } from "@/components/TrackedWhatsAppLink";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";

export function ConsultationEntry() {
  const t = useTranslations("consultationEntry");
  const locale = useLocale();
  const [service, setService] = useState("unsure");
  const [timing, setTiming] = useState("undecided");
  const [language, setLanguage] = useState(locale);
  const services = ["unsure", "skin", "plastic", "dental", "oriental", "transport"];
  const timings = ["undecided", "month", "quarter", "later"];
  const languages = [{ value: "en", label: "English" }, { value: "id", label: "Bahasa Indonesia" }, { value: "ko", label: "한국어" }, { value: "zh", label: "中文（简体）" }, { value: "th", label: "ไทย" }, { value: "vi", label: "Tiếng Việt" }];
  const wa = whatsappUrl(consultMessage({ locale, extra: `${t("interest")}: ${t(`services.${service}`)}\n${t("timing")}: ${t(`timings.${timing}`)}\n${t("language")}: ${languages.find(item => item.value === language)?.label}` }));
  const fieldClass = "mt-2 w-full min-w-0 rounded-md border border-beautiro-border bg-white px-3 py-3 text-base text-beautiro-charcoal sm:text-sm focus:outline-none focus:ring-2 focus:ring-beautiro-primary";
  return (
    <section aria-labelledby="consultation-entry-title" className="rounded-xl border border-beautiro-border bg-white p-4 sm:p-8 lg:p-10">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-beautiro-primary">{t("eyebrow")}</p>
          <h1 id="consultation-entry-title" className="mt-3 text-2xl font-semibold leading-tight break-words text-balance text-beautiro-charcoal sm:text-3xl">{t("title")}</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-beautiro-muted">{t("description")}</p>
          <Link href="/hospitals" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-beautiro-primary">{t("hospitals")}<ArrowRight size={16} className="shrink-0" aria-hidden /></Link>
          <p className="mt-5 text-xs leading-6 text-beautiro-muted">{t("costNote")}</p>
        </div>
        <div className="min-w-0 rounded-lg bg-beautiro-surface p-4 sm:p-6">
          <h2 className="text-base font-semibold">{t("startTitle")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <label className="min-w-0 text-sm font-medium" htmlFor="quick-service">{t("interest")}<select id="quick-service" value={service} onChange={e => setService(e.target.value)} className={fieldClass}>{services.map(value => <option key={value} value={value}>{t(`services.${value}`)}</option>)}</select></label>
            <label className="min-w-0 text-sm font-medium" htmlFor="quick-timing">{t("timing")}<select id="quick-timing" value={timing} onChange={e => setTiming(e.target.value)} className={fieldClass}>{timings.map(value => <option key={value} value={value}>{t(`timings.${value}`)}</option>)}</select></label>
            <label className="min-w-0 text-sm font-medium sm:col-span-2 lg:col-span-1" htmlFor="quick-language">{t("language")}<select id="quick-language" value={language} onChange={e => setLanguage(e.target.value)} className={fieldClass}>{languages.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          </div>
          <TrackedWhatsAppLink href={wa} location="home_quick_consultation" className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-beautiro-primary px-4 py-3 text-center text-sm font-semibold text-white hover:bg-beautiro-primary-deep"><MessageCircle size={18} strokeWidth={1.5} className="shrink-0" aria-hidden />{t("cta")}</TrackedWhatsAppLink>
          <p className="mt-3 text-xs leading-5 text-beautiro-muted">{t("sendNote")}</p>
          <Link href="/book" className="mt-3 inline-flex text-xs font-semibold text-beautiro-primary underline underline-offset-4">{t("online")}</Link>
        </div>
      </div>
      <ol className="mt-8 grid gap-4 border-t border-beautiro-border pt-6 sm:grid-cols-3">
        {["consult", "plan", "visit"].map((key, i) => <li key={key} className="flex min-w-0 gap-3"><span className="text-xs font-semibold text-beautiro-primary">0{i + 1}</span><div className="min-w-0"><h3 className="text-sm font-semibold">{t(`journey.${key}.title`)}</h3><p className="mt-1 text-xs leading-6 text-beautiro-muted">{t(`journey.${key}.desc`)}</p></div></li>)}
      </ol>
    </section>
  );
}
