"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogOut, MessageCircle, UserRound } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { PublicUser } from "@/lib/auth/user";

type AuthMode = "login" | "signup";

export function useAuth() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = (await res.json()) as { user?: PublicUser | null };
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { user, loading, refresh, setUser };
}

export function AuthPanel({ wa }: { wa: string }) {
  const t = useTranslations("auth");
  const tBook = useTranslations("book");
  const locale = useLocale() as Locale;
  const { user, loading, refresh, setUser } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const googleHref = `/api/auth/google?locale=${locale}&returnTo=${encodeURIComponent(`/${locale}/book?tab=account`)}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const body =
        mode === "signup"
          ? { email, password, name, phone: phone || undefined, locale }
          : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        user?: PublicUser;
        error?: string;
      };

      if (!res.ok) {
        if (data.error === "EMAIL_TAKEN") {
          setError(t("emailTaken"));
        } else if (data.error === "INVALID_CREDENTIALS") {
          setError(t("invalidCredentials"));
        } else {
          setError(t("genericError"));
        }
        return;
      }

      setUser(data.user ?? null);
      if (mode === "signup") {
        setVerifyMessage(t("signupVerifySent"));
      }
      await refresh();
    } catch {
      setError(t("genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setPassword("");
      setVerifyMessage(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function resendVerification() {
    setSubmitting(true);
    setVerifyMessage(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      if (!res.ok) throw new Error("failed");
      setVerifyMessage(t("verifyResent"));
    } catch {
      setError(t("genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md py-10 text-center text-sm text-beautiro-muted">
        …
      </div>
    );
  }

  if (user) {
    return (
      <div className="mx-auto max-w-md py-6 sm:py-10">
        <div className="rounded-2xl border border-beautiro-border bg-beautiro-surface/60 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-beautiro-primary/10 text-beautiro-primary">
            <UserRound size={28} strokeWidth={1.5} />
          </div>
          <h2 className="font-display mt-4 text-xl font-semibold text-beautiro-charcoal">
            {t("loggedInTitle")}
          </h2>
          <p className="mt-2 text-sm text-beautiro-muted">
            {t("loggedInAs", { name: user.name })}
          </p>
          <p className="mt-1 text-xs text-beautiro-muted-light">{user.email}</p>
        </div>

        {!user.emailVerified && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p>{t("verifyBanner")}</p>
            <button
              type="button"
              onClick={() => void resendVerification()}
              disabled={submitting}
              className="mt-2 font-semibold text-beautiro-primary hover:underline disabled:opacity-40"
            >
              {t("resendVerification")}
            </button>
          </div>
        )}

        {verifyMessage && (
          <p className="mt-4 rounded-xl bg-beautiro-surface px-4 py-3 text-sm text-beautiro-charcoal">
            {verifyMessage}
          </p>
        )}

        <div className="mt-5 grid gap-3">
          <Link
            href="/book?tab=bookings"
            className="flex h-11 items-center justify-center rounded-xl bg-beautiro-primary text-sm font-semibold text-white hover:bg-beautiro-primary-hover"
          >
            {t("myBookings")}
          </Link>
          {user.role === "ADMIN" && (
            <a
              href="/admin"
              className="flex h-11 items-center justify-center rounded-xl border border-beautiro-charcoal bg-beautiro-charcoal text-sm font-semibold text-white hover:bg-beautiro-charcoal-hover"
            >
              {t("adminPanel")}
            </a>
          )}
          <Link
            href="/book"
            className="flex h-11 items-center justify-center rounded-xl border border-beautiro-border bg-white text-sm font-semibold text-beautiro-charcoal hover:bg-beautiro-surface"
          >
            {tBook("accountBack")}
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-beautiro-border text-sm font-medium text-beautiro-muted hover:bg-beautiro-surface hover:text-beautiro-charcoal disabled:opacity-40"
          >
            <LogOut size={16} />
            {t("logout")}
          </button>
        </div>

        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-beautiro-primary hover:underline"
        >
          <MessageCircle size={16} />
          {tBook("accountCta")}
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-6 sm:py-10">
      <h2 className="font-display text-center text-xl font-semibold text-beautiro-charcoal">
        {mode === "signup" ? t("signupTitle") : t("loginTitle")}
      </h2>
      <p className="mt-2 text-center text-sm leading-relaxed text-beautiro-muted">
        {mode === "signup" ? t("signupDesc") : t("loginDesc")}
      </p>

      <a
        href={googleHref}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-beautiro-border bg-white text-sm font-semibold text-beautiro-charcoal hover:bg-beautiro-surface"
      >
        <span className="text-base">G</span>
        {t("googleButton")}
      </a>

      <div className="my-4 flex items-center gap-3 text-xs text-beautiro-muted-light">
        <div className="h-px flex-1 bg-beautiro-border" />
        {t("orContinueWithEmail")}
        <div className="h-px flex-1 bg-beautiro-border" />
      </div>

      <div className="flex rounded-xl border border-beautiro-border bg-beautiro-surface p-1">
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
          }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            mode === "signup"
              ? "bg-white text-beautiro-primary shadow-sm"
              : "text-beautiro-muted"
          }`}
        >
          {t("signupTab")}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            mode === "login"
              ? "bg-white text-beautiro-primary shadow-sm"
              : "text-beautiro-muted"
          }`}
        >
          {t("loginTab")}
        </button>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-5 grid gap-3">
        {mode === "signup" && (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              required
              minLength={2}
              className="w-full rounded-xl border border-beautiro-border px-4 py-3 text-sm outline-none focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
              className="w-full rounded-xl border border-beautiro-border px-4 py-3 text-sm outline-none focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10"
            />
          </>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          required
          autoComplete="email"
          className="w-full rounded-xl border border-beautiro-border px-4 py-3 text-sm outline-none focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("passwordPlaceholder")}
          required
          minLength={mode === "signup" ? 8 : 1}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="w-full rounded-xl border border-beautiro-border px-4 py-3 text-sm outline-none focus:border-beautiro-primary/50 focus:ring-2 focus:ring-beautiro-primary/10"
        />
        {mode === "signup" && (
          <p className="text-xs text-beautiro-muted-light">{t("passwordHint")}</p>
        )}
        {mode === "login" && (
          <p className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-beautiro-primary hover:underline"
            >
              {t("forgotLink")}
            </Link>
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}
        {verifyMessage && (
          <p className="rounded-lg bg-beautiro-surface px-4 py-3 text-sm text-beautiro-charcoal">
            {verifyMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="h-11 rounded-xl bg-beautiro-primary text-sm font-semibold text-white transition-colors hover:bg-beautiro-primary-hover disabled:opacity-40"
        >
          {submitting
            ? t("submitting")
            : mode === "signup"
              ? t("signupButton")
              : t("loginButton")}
        </button>
      </form>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-beautiro-primary hover:underline"
      >
        <MessageCircle size={16} />
        {tBook("accountCta")}
      </a>
    </div>
  );
}
