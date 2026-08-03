"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  Home,
  Search,
  Headset,
  CalendarCheck,
  User,
} from "lucide-react";

type TabKey = "home" | "search" | "concierge" | "bookings" | "mypage";

export function BottomNav() {
  const t = useTranslations("bottomNav");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const tabs: {
    key: TabKey;
    href: string;
    label: string;
    icon: typeof Home;
    match: () => boolean;
  }[] = [
    {
      key: "home",
      href: "/",
      label: t("home"),
      icon: Home,
      match: () => pathname === "/",
    },
    {
      key: "search",
      href: "/hospitals",
      label: t("search"),
      icon: Search,
      match: () => pathname.startsWith("/hospitals") || pathname.startsWith("/events"),
    },
    {
      key: "concierge",
      href: "/book",
      label: t("concierge"),
      icon: Headset,
      match: () => pathname === "/book" && !tab,
    },
    {
      key: "bookings",
      href: "/book?tab=history",
      label: t("bookings"),
      icon: CalendarCheck,
      match: () => pathname === "/book" && tab === "history",
    },
    {
      key: "mypage",
      href: "/book?tab=account",
      label: t("mypage"),
      icon: User,
      match: () => pathname === "/book" && tab === "account",
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-beautiro-border bg-white/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label={t("ariaLabel")}
    >
      <ul className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-1">
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = item.match();
          return (
            <li key={item.key} className="flex flex-1">
              <Link
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition-colors ${
                  active
                    ? "text-beautiro-primary"
                    : "text-beautiro-muted hover:text-beautiro-charcoal"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2 : 1.5}
                  className={active ? "text-beautiro-primary" : undefined}
                />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
