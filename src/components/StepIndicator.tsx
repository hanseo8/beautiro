export function StepIndicator({
  current,
  labels,
  descriptions,
  layout = "horizontal",
}: {
  current: number;
  total?: number;
  labels: string[];
  descriptions?: string[];
  layout?: "horizontal" | "vertical";
}) {
  if (layout === "vertical") {
    return (
      <ol className="space-y-0">
        {labels.map((label, index) => {
          const step = index + 1;
          const active = step === current;
          const done = step < current;
          return (
            <li
              key={label}
              className="relative flex gap-3.5 pb-7 last:pb-0"
            >
              {index < labels.length - 1 && (
                <span
                  className={`absolute left-[13px] top-7 h-[calc(100%-20px)] w-px ${
                    done ? "bg-beautiro-primary" : "bg-beautiro-border"
                  }`}
                  aria-hidden
                />
              )}
              <span
                className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  active
                    ? "bg-beautiro-primary text-white"
                    : done
                      ? "border border-beautiro-primary bg-beautiro-primary/10 text-beautiro-primary"
                      : "border border-beautiro-border bg-white text-beautiro-muted"
                }`}
              >
                {done ? "✓" : step}
              </span>
              <div className="min-w-0 pt-0.5">
                <p
                  className={`text-sm font-semibold leading-snug ${
                    active
                      ? "text-beautiro-charcoal"
                      : done
                        ? "text-beautiro-primary"
                        : "text-beautiro-muted"
                  }`}
                >
                  {label}
                </p>
                {descriptions?.[index] && (
                  <p className="mt-1 text-xs leading-relaxed text-beautiro-muted">
                    {descriptions[index]}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {labels.map((label, index) => {
          const step = index + 1;
          const active = step === current;
          const done = step < current;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    active
                      ? "bg-beautiro-primary text-white"
                      : done
                        ? "bg-beautiro-primary/10 text-beautiro-primary"
                        : "bg-beautiro-surface text-beautiro-muted"
                  }`}
                >
                  {done ? "✓" : step}
                </span>
                <span
                  className={`hidden max-w-[5.5rem] truncate text-center text-[10px] font-medium sm:block ${
                    active ? "text-beautiro-primary" : "text-beautiro-muted"
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < labels.length - 1 && (
                <span
                  className={`mb-5 h-px flex-1 ${
                    done ? "bg-beautiro-primary" : "bg-beautiro-border"
                  }`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
