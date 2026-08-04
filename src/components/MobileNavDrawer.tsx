"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  X,
  Home,
  Building2,
  CalendarCheck,
  User,
  Car,
  Info,
  Languages,
  Wallet,
  MessageCircle,
  HelpCircle,
  Gift,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { TrackedWhatsAppLink } from "@/components/TrackedWhatsAppLink";
import { consultMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileNavDrawer({ open, onClose }: Props) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const wa = whatsappUrl(consultMessage({ locale }));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const mainLinks = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/welcome", label: t("welcome"), icon: Sparkles },
    { href: "/brand-story", label: t("brandStory"), icon: BookOpen },
    { href: "/#services", label: t("services"), icon: Info },
    { href: "/hospitals", label: t("hospitals"), icon: Building2 },
    { href: "/reviews", label: t("reviews"), icon: Gift },
    { href: "/#faq", label: t("faq"), icon: HelpCircle },
  ] as const;

  const serviceLinks = [
    { href: "/#services", label: t("servicesVan"), icon: Car },
    { href: "/#services", label: t("servicesMate"), icon: Languages },
    { href: "/#services", label: t("servicesPay"), icon: Wallet },
  ] as const;

  const accountLinks = [
    { href: "/book?tab=bookings&view=history", label: t("reservations"), icon: CalendarCheck },
    { href: "/book?tab=account", label: t("mypage"), icon: User },
  ] as const;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-[#0f172a]/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-[70] flex w-[min(100vw-3rem,320px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
        aria-label={t("menuOpen")}
      >
        <div className="flex h-14 items-center justify-between border-b border-beautiro-border px-4">
          <span className="font-brand text-lg font-bold text-beautiro-primary">
            Beautiro
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-beautiro-charcoal hover:bg-beautiro-surface"
            aria-label={t("menuClose")}
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="text-label text-beautiro-muted">{t("menuMain")}</p>
          <ul className="mt-3 space-y-1">
            {mainLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={`${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-beautiro-charcoal transition-colors hover:bg-beautiro-surface"
                  >
                    <Icon size={18} strokeWidth={1.5} className="text-beautiro-primary" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="text-label mt-8 text-beautiro-muted">{t("servicesTitle")}</p>
          <ul className="mt-3 space-y-1">
            {serviceLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-beautiro-charcoal transition-colors hover:bg-beautiro-surface"
                  >
                    <Icon size={18} strokeWidth={1.5} className="text-beautiro-primary" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="text-label mt-8 text-beautiro-muted">{t("menuAccount")}</p>
          <ul className="mt-3 space-y-1">
            {accountLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-beautiro-charcoal transition-colors hover:bg-beautiro-surface"
                  >
                    <Icon size={18} strokeWidth={1.5} className="text-beautiro-primary" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-2.5 border-t border-beautiro-border p-4">
          <LanguageSwitcher />
          <Link
            href="/book"
            onClick={onClose}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-beautiro-primary text-sm font-semibold text-white transition-colors hover:bg-beautiro-primary-hover"
          >
            {t("cta")}
          </Link>
          <TrackedWhatsAppLink
            href={wa}
            location="mobile_drawer"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-beautiro-border bg-white text-sm font-medium text-beautiro-charcoal transition-colors hover:bg-beautiro-surface"
          >
            <MessageCircle size={16} strokeWidth={1.5} />
            {t("whatsapp")}
          </TrackedWhatsAppLink>
          <Link
            href="/book?tab=account"
            onClick={onClose}
            className="block py-1 text-center text-xs font-medium text-beautiro-muted transition-colors hover:text-beautiro-primary"
          >
            {t("signIn")}
          </Link>
        </div>
      </aside>
    </>
  );
}
