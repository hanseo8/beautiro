"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

export function HomeSearch() {
  const t = useTranslations("home.search");
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (query) {
      router.push(`/hospitals?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/hospitals");
    }
  }

  const tags = t.raw("tags") as string[];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={submit} className="relative">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("placeholder")}
          className="h-14 w-full rounded-2xl border border-beautiro-border/80 bg-white pl-5 pr-14 text-base shadow-[0_8px_30px_rgba(15,23,42,0.04)] outline-none transition-all placeholder:text-beautiro-muted-light focus:border-beautiro-primary/40 focus:shadow-[0_8px_30px_rgba(26,95,95,0.1)] focus:ring-4 focus:ring-beautiro-primary/10"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-beautiro-primary text-white shadow-sm transition-colors hover:bg-beautiro-primary-hover"
          aria-label={t("placeholder")}
        >
          <Search size={20} strokeWidth={2.25} />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-beautiro-muted">
          {t("popularLabel")}
        </span>
        <span className="hidden h-3 w-px bg-beautiro-border sm:block" aria-hidden />
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() =>
              router.push(`/hospitals?q=${encodeURIComponent(tag)}`)
            }
            className="rounded-full border border-beautiro-border bg-white px-3 py-1 text-xs font-medium text-beautiro-muted transition-colors hover:border-beautiro-primary/30 hover:text-beautiro-primary"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
