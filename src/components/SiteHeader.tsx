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
    <header className="sticky top-0 z-50 border-b border-beautiro-border/80 bg-white/90 backdrop-blur-md">
      <div className="container-babitalk flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-brand text-xl font-bold tracking-tight text-beautiro-primary sm:text-2xl"
        >
          Beautiro
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-beautiro-charcoal lg:flex">
          <Link
            href="/"
            className="transition-colors hover:text-beautiro-primary"
          >
            {t("home")}
          </Link>
          <Link
            href="/hospitals"
            className="transition-colors hover:text-beautiro-primary"
          >
            {t("events")}
          </Link>
          <Link
            href="/hospitals"
            className="transition-colors hover:text-beautiro-primary"
          >
            {t("hospitals")}
          </Link>
          <Link
            href="/book"
            className="transition-colors hover:text-beautiro-primary"
          >
            {t("book")}
          </Link>
          <Link
            href="/#faq"
            className="transition-colors hover:text-beautiro-primary"
          >
            {t("faq")}
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-xl border border-[#25D366]/30 bg-[#25D366]/8 px-3 py-2 text-xs font-bold text-[#128C7E] transition-colors hover:bg-[#25D366]/12 sm:inline-block"
          >
            {t("whatsapp")}
          </a>
          <ButtonLink
            href="/book"
            variant="pill"
            className="text-xs sm:text-sm"
          >
            {t("login")}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
