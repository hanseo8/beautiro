import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
};

export function CoverImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 400px",
  objectPosition = "center center",
  objectFit = "cover",
}: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`${objectFit === "contain" ? "object-contain" : "object-cover"} ${className}`}
      style={{ objectPosition }}
      sizes={sizes}
      priority={priority}
    />
  );
}
