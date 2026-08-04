"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ButtonLink } from "./ui/Button";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { TopUtilBar } from "./TopUtilBar";

const navItems = [
  { href: "/", labelKey: "home" as const, match: (p: string) => p === "/" },
  {
    href: "/#services",
    labelKey: "services" as const,
    match: () => false,
  },
  {
    href: "/hospitals",
    labelKey: "hospitals" as const,
    match: (p: string) =>
      p.startsWith("/hospitals") || p.startsWith("/events"),
  },
  {
    href: "/#faq",
    labelKey: "faq" as const,
    match: () => false,
  },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={`sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled
            ? "shadow-[0_4px_24px_rgba(15,23,42,0.1)]"
            : "shadow-none"
        }`}
      >
        <TopUtilBar compact={scrolled} />
        <header className="border-b border-beautiro-border/80 bg-white/95 backdrop-blur-md">
          <div
            className={`container-babitalk flex items-center gap-4 transition-all duration-300 lg:gap-8 ${
              scrolled ? "h-11" : "h-14"
            }`}
          >
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <span
                className={`font-brand font-bold tracking-tight text-beautiro-primary transition-all duration-300 ${
                  scrolled ? "text-lg" : "text-xl"
                }`}
              >
                Beautiro
              </span>
              <span className="hidden border-l border-beautiro-border pl-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-beautiro-muted lg:block">
                {t("brandSubtitle")}
              </span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
              {navItems.map((item) => {
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.labelKey}
                    href={item.href}
                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-beautiro-surface text-beautiro-primary"
                        : "text-beautiro-muted hover:bg-beautiro-surface/60 hover:text-beautiro-charcoal"
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
              <LanguageSwitcher compact />

              <div className="hidden items-center gap-2 md:flex">
                <span
                  className="h-5 w-px bg-beautiro-border"
                  aria-hidden
                />
                <Link
                  href="/book?tab=account"
                  className="whitespace-nowrap px-1 text-xs font-medium leading-none text-beautiro-muted transition-colors hover:text-beautiro-primary"
                >
                  {t("signIn")}
                </Link>
                <ButtonLink
                  href="/book"
                  variant="primary"
                  className={`shrink-0 whitespace-nowrap px-4 py-0 text-xs leading-none ${
                    scrolled ? "h-8" : "h-9"
                  }`}
                >
                  {t("cta")}
                </ButtonLink>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-beautiro-border text-beautiro-charcoal transition-colors hover:bg-beautiro-surface lg:hidden"
                aria-label={t("menuOpen")}
                aria-expanded={menuOpen}
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </header>
      </div>
      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
