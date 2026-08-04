"use client";

import type { ComponentProps, ReactNode } from "react";
import { trackWhatsAppClick } from "@/lib/analytics";

type Props = ComponentProps<"a"> & {
  location: string;
  children: ReactNode;
};

export function TrackedWhatsAppLink({
  href,
  location,
  className,
  children,
  onClick,
  target = "_blank",
  rel = "noopener noreferrer",
  ...rest
}: Props) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={(e) => {
        trackWhatsAppClick(location);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
