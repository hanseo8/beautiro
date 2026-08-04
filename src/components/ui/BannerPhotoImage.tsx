import { CoverImage } from "@/components/ui/CoverImage";
import type { BannerPhoto } from "@/lib/media";

type Props = {
  banner: BannerPhoto;
  alt: string;
  priority?: boolean;
};

export function BannerPhotoImage({ banner, alt, priority = false }: Props) {
  const fit = banner.fit ?? "cover";

  return (
    <>
      {fit === "contain" && (
        <div className="absolute inset-0 bg-[#1a2332]" aria-hidden />
      )}
      <CoverImage
        src={banner.src}
        alt={alt}
        priority={priority}
        objectPosition={banner.position}
        objectFit={fit}
        sizes="(max-width: 1080px) 100vw, 1080px"
      />
    </>
  );
}
