import type { MedicalCategory } from "@prisma/client";

/** Wikimedia Commons — verified real photos (CC / public domain). */
function wiki(path: string, w = 1280) {
  const name = path.split("/").pop()!;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${w}px-${name}`;
}

/**
 * Korea-verified photography mapped to slide / hospital context.
 * Sources: Wikimedia Commons only (no stock/AI-looking Unsplash).
 */
export const KOREA_IMAGES = {
  /** Slide 1 — 인천공항 1터미널 도착층 (VIP 픽업) */
  incheonAirportArrival: wiki(
    "7/70/Incheon_International_Airport_Terminal_1_Arrival.jpg",
  ),

  /** Slide 2 — 서울아산병원 캠퍼스 (성형·피부·의료 전문) */
  asanMedicalCenter: wiki("e/e0/Asan_Medical_Center.jpg"),

  /** Slide 3 — 대한민국 원·동전 (Beautiro Pay 환전·결제) */
  koreanCurrency: wiki("5/52/Currency_South_Korea.jpg"),

  /** 성형외과 — 순천향대학교 서울병원 */
  soonchunhyangSeoulHospital: wiki(
    "e/e6/Soonchunhyang_University_Seoul_Hospital.png",
    960,
  ),

  /** 피부·치과 — 건국대학교병원 */
  konkukUniversityHospital: wiki(
    "7/77/Konkuk_University_Hospital_20241102_003.jpg",
    960,
  ),

  /** 한의원 — 서울한방진흥센터 보제원 */
  seoulKMediCenter: wiki("9/98/Seoul_K-Medi_Center.jpg", 960),

  /** 한방병원 — 한약재 (전통 한의학) */
  hanyakTraditionalMedicine: wiki(
    "d/d3/Hanyak_(traditional_Korean_medicine).jpg",
    960,
  ),

  /** 인천 송도 — 인천 제휴 병원 지역 */
  incheonSongdo: wiki(
    "f/f8/South_Korea%2C_Incheon%2C_Songdo%2C_the_Prugio_Central_Park_Towers%2C_Sharp_First_World_Towers%2C_and_Sheraton_Hotel.jpg",
    960,
  ),
} as const;

/** Hero carousel — must match ko.json slide order */
export const heroSlideImages = [
  KOREA_IMAGES.incheonAirportArrival,
  KOREA_IMAGES.asanMedicalCenter,
  KOREA_IMAGES.koreanCurrency,
] as const;

/** Home promo banner carousel — open special, cosmetics gift */
export const promoBannerImages = [
  KOREA_IMAGES.incheonAirportArrival,
  KOREA_IMAGES.hanyakTraditionalMedicine,
] as const;

export const hospitalCoverImages: Record<string, string> = {
  "arena-oriental-clinic": KOREA_IMAGES.seoulKMediCenter,
  "arena-oriental-hospital": KOREA_IMAGES.hanyakTraditionalMedicine,
  "seran-plastic": KOREA_IMAGES.soonchunhyangSeoulHospital,
  "seran-plus-plastic": KOREA_IMAGES.asanMedicalCenter,
  "seran-dermatology": KOREA_IMAGES.konkukUniversityHospital,
  "seran-dental": KOREA_IMAGES.konkukUniversityHospital,
  "seoul-central-dental": KOREA_IMAGES.konkukUniversityHospital,
};

export const categoryFallbackImages: Record<MedicalCategory, string> = {
  PLASTIC: KOREA_IMAGES.soonchunhyangSeoulHospital,
  DERMATOLOGY: KOREA_IMAGES.konkukUniversityHospital,
  ORIENTAL: KOREA_IMAGES.seoulKMediCenter,
  DENTAL: KOREA_IMAGES.konkukUniversityHospital,
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
