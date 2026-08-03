"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ButtonLink } from "./ui/Button";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/routing";

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const wa = whatsappUrl(consultMessage({ locale }));

  return (
    <header className="sticky top-0 z-50 border-b border-beautiro-border bg-white/95 backdrop-blur-sm">
      <div className="container-babitalk flex h-[52px] items-center justify-between gap-4">
        <Link
          href="/"
          className="font-brand text-2xl font-bold tracking-tight text-beautiro-primary-deep"
        >
          Beautiro
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-beautiro-charcoal lg:flex">
          <Link href="/" className="hover:text-beautiro-primary">
            {t("home")}
          </Link>
          <Link href="/hospitals" className="hover:text-beautiro-primary">
            {t("events")}
          </Link>
          <Link href="/hospitals" className="hover:text-beautiro-primary">
            {t("hospitals")}
          </Link>
          <Link href="/book" className="hover:text-beautiro-primary">
            {t("book")}
          </Link>
          <Link href="/#faq" className="hover:text-beautiro-primary">
            {t("faq")}
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-1.5 text-xs font-bold text-[#128C7E] hover:bg-[#25D366]/15 sm:inline-block"
          >
            {t("whatsapp")}
          </a>
          <ButtonLink href="/book" variant="pill" className="text-xs sm:text-sm">
            {t("login")}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
