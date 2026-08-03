import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

const base =
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-beautiro-primary";

const variants = {
  primary: `${base} bg-beautiro-primary px-5 py-2.5 text-white hover:bg-beautiro-primary-hover`,
  secondary: `${base} border border-beautiro-border bg-white px-5 py-2.5 text-beautiro-charcoal hover:bg-beautiro-surface`,
  ghost: `${base} rounded-lg px-2 py-1 font-medium text-beautiro-muted hover:text-beautiro-charcoal`,
  pill: `${base} rounded-full bg-beautiro-accent-soft px-4 py-2 text-beautiro-primary-deep hover:bg-beautiro-primary/10`,
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof variants }) {
  return (
    <button
      type="button"
      className={`${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  href,
  className = "",
  children,
}: {
  variant?: keyof typeof variants;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
