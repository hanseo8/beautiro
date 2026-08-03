import type { MedicalCategory } from "@prisma/client";

/** Unsplash CDN helper */
function u(id: string, w = 1200) {
  return `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
}

/** Wikimedia Commons thumb helper */
function wiki(file: string, w = 1280) {
  const parts = file.split("/");
  const name = parts[parts.length - 1]!;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${file}/${w}px-${name}`;
}

/**
 * Korea-verified photography mapped to slide / hospital context.
 * Sources: Wikimedia Commons (CC) + Unsplash (location-tagged Seoul/Incheon).
 */
export const KOREA_IMAGES = {
  /** 인천공항 터미널 — VIP 픽업·공항 도착 */
  incheonAirport:
    wiki("7/70/Incheon_International_Airport_Terminal_1_Arrival.jpg"),

  /** 서울 의료·미용 거리 — 메디컬 통역·상담 */
  seoulMedicalDistrict: u("photo-1538485399081-7191377e8241"),

  /** 한국 원화 — Beautiro Pay 환전·결제 */
  koreanWon: wiki("8/84/Currency_South_Korea.jpg"),

  /** 북촌 한옥 + 서울 스카이라인 — 한의원·한방 */
  bukchonHanok: u("photo-1677107129789-3b0241fb727a", 800),

  /** 인천 송도 국제도시 — 한방병원·인천 제휴 */
  incheonSongdo:
    wiki(
      "f/f4/South_Korea%2C_Incheon%2C_Songdo%2C_the_Prugio_Central_Park_Towers%2C_Sharp_First_World_Towers%2C_and_Sheraton_Hotel.jpg",
      800,
    ),

  /** 서울 야경 고층빌딩 — 성형외과·의료관광 */
  seoulNightSkyline: u("photo-1532649097480-b67d52743b69", 800),

  /** 서울 도심 고층빌딩 — 성형·리프팅 클리닉 */
  seoulHighRise: u("photo-1554310603-d39d43033735", 800),

  /** 서울 남산 전망 — 피부과·시술 케어 */
  seoulNamsan: u("photo-1747683203882-25ba3f153a15", 800),

  /** 서울 도심 거리 — 치과·안산(수도권) */
  seoulCityStreet: u("photo-1517154421773-0529f29ea451", 800),

  /** 경복궁 한옥 — 한방·웰니스 */
  gyeongbokgung: u("photo-1761500997474-fd6446e2abaa", 800),
} as const;

/** Hero carousel — matches ko.json slide order */
export const heroSlideImages = [
  KOREA_IMAGES.incheonAirport,
  KOREA_IMAGES.seoulMedicalDistrict,
  KOREA_IMAGES.koreanWon,
] as const;

export const hospitalCoverImages: Record<string, string> = {
  "arena-oriental-clinic": KOREA_IMAGES.bukchonHanok,
  "arena-oriental-hospital": KOREA_IMAGES.incheonSongdo,
  "seran-plastic": KOREA_IMAGES.seoulNightSkyline,
  "seran-plus-plastic": KOREA_IMAGES.seoulHighRise,
  "seran-dermatology": KOREA_IMAGES.seoulNamsan,
  "seran-dental": KOREA_IMAGES.seoulCityStreet,
  "seoul-central-dental": KOREA_IMAGES.seoulCityStreet,
};

export const categoryFallbackImages: Record<MedicalCategory, string> = {
  PLASTIC: KOREA_IMAGES.seoulNightSkyline,
  DERMATOLOGY: KOREA_IMAGES.seoulNamsan,
  ORIENTAL: KOREA_IMAGES.gyeongbokgung,
  DENTAL: KOREA_IMAGES.seoulCityStreet,
};

export function resolveHospitalImage(
  slug: string,
  category: MedicalCategory,
  coverImage?: string | null,
): string {
  return coverImage ?? hospitalCoverImages[slug] ?? categoryFallbackImages[category];
}
