"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/routing";

export function SiteFooter() {
  const t = useTranslations("footer");
  const locale = useLocale() as Locale;
  const wa = whatsappUrl(consultMessage({ locale }));

  const links = t.raw("links") as { label: string; href: string }[];

  return (
    <footer className="mt-auto border-t border-beautiro-border bg-white">
      <div className="container-babitalk border-b border-beautiro-border py-8">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:bg-[#20BD5A]"
        >
          {t("whatsappCta")}
        </a>
        <p className="mt-3 text-xs text-beautiro-muted">{t("whatsappHours")}</p>
      </div>
      <div className="container-babitalk py-10">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <p className="font-brand text-xl font-bold text-beautiro-primary-deep">Beautiro</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-beautiro-muted">
              {t("tagline")}
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-beautiro-muted">
            {links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-beautiro-charcoal">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="rounded border border-beautiro-border px-2 py-1 text-xs font-semibold text-beautiro-muted">
            {t("badgePrivacy")}
          </span>
          <span className="rounded border border-beautiro-border px-2 py-1 text-xs font-semibold text-beautiro-muted">
            {t("badgePartner")}
          </span>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-beautiro-muted-light">
          {t("company")}
        </p>
        <p className="mt-4 text-center text-xs text-beautiro-muted-light md:text-left">
          {t("rights")}
        </p>
      </div>
    </footer>
  );
}
