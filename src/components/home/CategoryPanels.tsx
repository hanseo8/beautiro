import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function CategoryPanels() {
  const t = await getTranslations("home.categories");

  const plastic = t.raw("plastic") as string[];
  const care = t.raw("care") as string[];

  return (
    <section className="grid gap-10 md:grid-cols-2 md:gap-12">
      <CategoryColumn
        title={t("plasticTitle")}
        items={plastic}
        moreLabel={t("more")}
        moreHref="/hospitals?category=PLASTIC"
      />
      <CategoryColumn
        title={t("careTitle")}
        items={care}
        moreLabel={t("more")}
        moreHref="/hospitals?category=DERMATOLOGY"
      />
    </section>
  );
}

function CategoryColumn({
  title,
  items,
  moreLabel,
  moreHref,
}: {
  title: string;
  items: string[];
  moreLabel: string;
  moreHref: string;
}) {
  return (
    <div>
      <h3 className="text-section-title text-beautiro-charcoal">{title}</h3>
      <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {items.map((label) => (
          <li key={label}>
            <Link
              href={`/hospitals?q=${encodeURIComponent(label)}`}
              className="flex items-center justify-between rounded-xl border border-beautiro-border bg-white px-3 py-3 text-sm font-medium text-beautiro-charcoal transition-colors hover:border-beautiro-primary/50 hover:bg-beautiro-accent-soft/50"
            >
              <span className="truncate pr-1">{label}</span>
              <ChevronRight
                size={16}
                className="shrink-0 text-beautiro-muted-light"
              />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={moreHref}
        className="mt-3 flex w-full items-center justify-center rounded-xl border border-beautiro-border bg-beautiro-surface py-3 text-sm font-medium text-beautiro-muted hover:bg-beautiro-accent-soft/40"
      >
        {moreLabel}
      </Link>
    </div>
  );
}
