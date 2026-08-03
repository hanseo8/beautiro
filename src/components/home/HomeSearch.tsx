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
    <section className="pt-6 pb-8 md:pt-8 md:pb-10">
      <form onSubmit={submit} className="relative mx-auto max-w-[640px]">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("placeholder")}
          className="h-[52px] w-full rounded-full border border-beautiro-border bg-beautiro-surface pl-5 pr-[52px] text-base shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-shadow focus:border-beautiro-primary focus:ring-2 focus:ring-beautiro-primary/15"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-beautiro-primary text-white hover:bg-beautiro-primary-hover"
          aria-label={t("placeholder")}
        >
          <Search size={20} strokeWidth={2.25} />
        </button>
      </form>
      <div className="mx-auto mt-4 max-w-[640px]">
        <p className="text-xs font-semibold text-beautiro-charcoal">
          {t("popularLabel")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                router.push(`/hospitals?q=${encodeURIComponent(tag)}`)
              }
              className="rounded-full border border-beautiro-border bg-white px-3.5 py-1.5 text-xs font-medium text-beautiro-muted transition-colors hover:border-beautiro-primary/50 hover:text-beautiro-primary"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
