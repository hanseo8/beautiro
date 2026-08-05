"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function VerifyEmailStatus() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const message =
    status === "success"
      ? t("verifySuccess")
      : status === "invalid"
        ? t("verifyInvalid")
        : t("verifyPending");

  return (
    <div className="mx-auto max-w-md py-8 text-center">
      <h1 className="font-display text-2xl font-semibold text-beautiro-charcoal">
        {t("verifyTitle")}
      </h1>
      <p className="mt-4 rounded-xl bg-beautiro-surface px-4 py-4 text-sm leading-relaxed text-beautiro-charcoal">
        {message}
      </p>
      <Link
        href="/book?tab=account"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-beautiro-primary px-5 text-sm font-semibold text-white"
      >
        {t("backToAccount")}
      </Link>
    </div>
  );
}
