"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Menu } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ButtonLink } from "./ui/Button";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/routing";

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const wa = whatsappUrl(consultMessage({ locale }));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-beautiro-border/80 bg-white/95 backdrop-blur-md">
        <div className="container-babitalk flex h-14 items-center justify-between gap-3">
          <Link
            href="/"
            className="font-brand text-xl font-bold tracking-tight text-beautiro-primary sm:text-2xl"
          >
            Beautiro
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-beautiro-charcoal lg:flex">
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
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher />
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg border border-beautiro-border px-3 py-2 text-xs font-semibold text-beautiro-primary transition-colors hover:bg-beautiro-surface sm:inline-block"
            >
              {t("whatsapp")}
            </a>
            <ButtonLink
              href="/book"
              variant="primary"
              className="hidden text-xs sm:inline-flex sm:text-sm"
            >
              {t("login")}
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-beautiro-border text-beautiro-charcoal transition-colors hover:bg-beautiro-surface lg:hidden"
              aria-label={t("menuOpen")}
              aria-expanded={menuOpen}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>
      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
