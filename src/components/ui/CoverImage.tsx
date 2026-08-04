import Image from "next/image";
import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
  mobileObjectPosition?: string;
  objectFit?: "cover" | "contain";
};

export function CoverImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 400px",
  objectPosition = "center center",
  mobileObjectPosition,
  objectFit = "cover",
}: Props) {
  const mobilePos = mobileObjectPosition ?? objectPosition;

  return (
    <div
      className={`cover-image-responsive absolute inset-0 ${className}`}
      style={
        {
          "--cover-pos-mobile": mobilePos,
          "--cover-pos-desktop": objectPosition,
        } as CSSProperties
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={objectFit === "contain" ? "object-contain" : "object-cover"}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
