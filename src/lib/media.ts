import type { MedicalCategory } from "@prisma/client";

/** Wikimedia Commons — verified real photos (CC / public domain). */
function wiki(path: string, w = 1280) {
  const name = path.split("/").pop()!;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${w}px-${name}`;
}

/** Wide banner thumbs — higher width for crisp object-cover crops. */
function wikiBanner(path: string, w = 1920) {
  return wiki(path, w);
}

export type BannerPhoto = {
  src: string;
  /** CSS object-position for wide banner crops (desktop) */
  position: string;
  /** Tighter crop on narrow screens — defaults to position */
  mobilePosition?: string;
  /** Use contain for non-wide photos so the full image stays inside the banner */
  fit?: "cover" | "contain";
};

/** Hero / simple overlay banners */
export const BANNER_FRAME_CLASS =
  "relative aspect-[3/2] min-h-[220px] overflow-hidden sm:aspect-[16/9] sm:min-h-[240px]";

/** Promo carousel — compact strip; grows on mobile when content needs room */
export const PROMO_BANNER_FRAME_CLASS =
  "relative min-h-[200px] overflow-hidden sm:aspect-[3.1/1] sm:min-h-[200px] sm:max-h-[240px]";

/**
 * Korea-verified photography mapped to slide / hospital context.
 * Sources: Wikimedia Commons only (no stock/AI-looking Unsplash).
 */
export const KOREA_IMAGES = {
  /** 인천공항 1터미널 도착층 (VIP 픽업) */
  incheonAirportArrival: wikiBanner(
    "7/70/Incheon_International_Airport_Terminal_1_Arrival.jpg",
  ),

  /** 서울아산병원 캠퍼스 */
  asanMedicalCenter: wikiBanner("e/e0/Asan_Medical_Center.jpg"),

  /** 건국대학교병원 외관 */
  konkukUniversityHospital: wikiBanner(
    "7/77/Konkuk_University_Hospital_20241102_003.jpg",
  ),

  /** 대한민국 원·동전 (환전·결제) */
  koreanCurrency: wikiBanner("5/52/Currency_South_Korea.jpg"),

  /** 순천향대학교 서울병원 */
  soonchunhyangSeoulHospital: wiki(
    "e/e6/Soonchunhyang_University_Seoul_Hospital.png",
    1280,
  ),

  /** 서울한방진흥센터 */
  seoulKMediCenter: wikiBanner("9/98/Seoul_K-Medi_Center.jpg"),

  /** K-뷰티 엑스포 코리아 (피부관리·뷰티 이벤트) */
  kBeautyExpoKorea: wikiBanner("0/09/K-Beauty_Expo_Korea.jpg"),

  /** K-뷰티 엑스포 베트남 (화장품·증정) */
  kBeautyExpoVietnam: wikiBanner("b/be/K-Beauty_Expo_Vietnam_1.jpg"),

  /** 화장품 기프트 박스 */
  koreanCosmeticsGiftBox: wikiBanner("0/00/Box_of_Korean_cosmetics.jpg"),

  /** K-뷰티 매장 선반 */
  koreanCosmeticsShelf: wikiBanner("4/42/Korean_cosmetics_on_a_shelf.jpg"),

  /** 인천 송도 */
  incheonSongdo: wiki(
    "f/f8/South_Korea%2C_Incheon%2C_Songdo%2C_the_Prugio_Central_Park_Towers%2C_Sharp_First_World_Towers%2C_and_Sheraton_Hotel.jpg",
    1280,
  ),
} as const;

/** Hero carousel — airport · hospital · payment (matches ko.json slide order) */
export const heroBannerImages: BannerPhoto[] = [
  {
    src: KOREA_IMAGES.incheonAirportArrival,
    position: "center 38%",
    mobilePosition: "center 42%",
  },
  {
    src: KOREA_IMAGES.konkukUniversityHospital,
    position: "center 45%",
    mobilePosition: "center 50%",
  },
  {
    src: KOREA_IMAGES.koreanCurrency,
    position: "center center",
    mobilePosition: "center center",
    fit: "contain",
  },
];

/** Home promo carousel — brand key phrase · review reward · open discount · cosmetics gift */
export const promoBannerImages: BannerPhoto[] = [
  {
    src: KOREA_IMAGES.incheonAirportArrival,
    position: "center 38%",
    mobilePosition: "center 42%",
  },
  {
    src: KOREA_IMAGES.kBeautyExpoKorea,
    position: "center 35%",
    mobilePosition: "center 40%",
  },
  {
    src: KOREA_IMAGES.asanMedicalCenter,
    position: "center 42%",
    mobilePosition: "center 48%",
  },
  {
    src: KOREA_IMAGES.kBeautyExpoVietnam,
    position: "center 38%",
    mobilePosition: "center 45%",
  },
];

/** @deprecated Use heroBannerImages */
export const heroSlideImages = heroBannerImages.map((b) => b.src);

export const hospitalCoverImages: Record<string, string> = {
  "arena-oriental-clinic": KOREA_IMAGES.seoulKMediCenter,
  "arena-oriental-hospital": KOREA_IMAGES.seoulKMediCenter,
  "seran-plastic": KOREA_IMAGES.konkukUniversityHospital,
  "seran-plus-plastic": KOREA_IMAGES.asanMedicalCenter,
  "seran-dermatology": KOREA_IMAGES.konkukUniversityHospital,
  "seran-dental": KOREA_IMAGES.konkukUniversityHospital,
  "seoul-central-dental": KOREA_IMAGES.konkukUniversityHospital,
  "namdaejeon-nursing-hospital": KOREA_IMAGES.asanMedicalCenter,
};

export const hospitalCoverPositions: Record<string, string> = {
  "arena-oriental-clinic": "center 45%",
  "arena-oriental-hospital": "center 45%",
  "seran-plastic": "center 42%",
  "seran-plus-plastic": "center 40%",
  "seran-dermatology": "center 42%",
  "seran-dental": "center 42%",
  "seoul-central-dental": "center 42%",
  "namdaejeon-nursing-hospital": "center 40%",
};

export const categoryFallbackImages: Record<MedicalCategory, string> = {
  PLASTIC: KOREA_IMAGES.konkukUniversityHospital,
  DERMATOLOGY: KOREA_IMAGES.konkukUniversityHospital,
  ORIENTAL: KOREA_IMAGES.seoulKMediCenter,
  DENTAL: KOREA_IMAGES.konkukUniversityHospital,
};

export const categoryFallbackPositions: Record<MedicalCategory, string> = {
  PLASTIC: "center 42%",
  DERMATOLOGY: "center 42%",
  ORIENTAL: "center 45%",
  DENTAL: "center 42%",
};

export function resolveHospitalImage(
  slug: string,
  category: MedicalCategory,
  coverImage?: string | null,
): string {
  return (
    coverImage ??
    hospitalCoverImages[slug] ??
    categoryFallbackImages[category]
  );
}

export function resolveHospitalImagePosition(
  slug: string,
  category: MedicalCategory,
): string {
  return (
    hospitalCoverPositions[slug] ?? categoryFallbackPositions[category]
  );
}
