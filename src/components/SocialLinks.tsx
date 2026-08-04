"use client";

import { useTranslations } from "next-intl";
import { SOCIAL } from "@/lib/social";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SocialLinks({ className = "" }: { className?: string }) {
  const t = useTranslations("social");

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={SOCIAL.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-beautiro-border px-3 py-2 text-sm font-medium text-beautiro-charcoal transition-colors hover:border-beautiro-primary/30 hover:text-beautiro-primary"
        aria-label={t("instagramAria")}
      >
        <InstagramIcon />
        @{SOCIAL.instagram.handle}
      </a>
    </div>
  );
}
