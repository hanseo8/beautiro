export function StepIndicator({
  current,
  labels,
  layout = "horizontal",
}: {
  current: number;
  total?: number;
  labels: string[];
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
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {index < labels.length - 1 && (
                <span
                  className={`absolute left-[7px] top-4 h-[calc(100%-8px)] w-px ${
                    done ? "bg-beautiro-primary" : "bg-beautiro-border"
                  }`}
                  aria-hidden
                />
              )}
              <span
                className={`relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border ${
                  active
                    ? "border-beautiro-primary bg-beautiro-primary"
                    : done
                      ? "border-beautiro-primary bg-beautiro-surface"
                      : "border-beautiro-border bg-beautiro-surface"
                }`}
              />
              <div>
                <p
                  className={`text-step-num ${
                    active ? "text-beautiro-primary" : "text-beautiro-muted"
                  }`}
                >
                  {String(step).padStart(2, "0")}
                </p>
                <p
                  className={`mt-1 text-sm leading-snug ${
                    active
                      ? "font-medium text-beautiro-charcoal"
                      : "text-beautiro-muted"
                  }`}
                >
                  {label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="border-b border-beautiro-border pb-6">
      <div className="mb-5 flex gap-1">
        {labels.map((_, index) => {
          const step = index + 1;
          const filled = step <= current;
          return (
            <span
              key={index}
              className={`h-px flex-1 ${
                filled ? "bg-beautiro-primary" : "bg-beautiro-border"
              }`}
            />
          );
        })}
      </div>
      <p className="text-3xl font-bold text-beautiro-charcoal">
        {labels[current - 1]}
      </p>
    </div>
  );
}
