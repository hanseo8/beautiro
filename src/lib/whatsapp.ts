/** E.164 without + (default placeholder — set NEXT_PUBLIC_WHATSAPP_NUMBER in .env) */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
  "6281234567890";

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function consultMessage(params: {
  locale: string;
  procedureName?: string;
  hospitalName?: string;
}): string {
  const { locale, procedureName, hospitalName } = params;
  if (locale === "ko") {
    return `[Beautiro] 상담 문의${procedureName ? `\n시술: ${procedureName}` : ""}${hospitalName ? `\n병원: ${hospitalName}` : ""}`;
  }
  if (locale === "id") {
    return `[Beautiro] Konsultasi${procedureName ? `\nProsedur: ${procedureName}` : ""}${hospitalName ? `\nKlinik: ${hospitalName}` : ""}`;
  }
  return `[Beautiro] Consultation request${procedureName ? `\nProcedure: ${procedureName}` : ""}${hospitalName ? `\nClinic: ${hospitalName}` : ""}`;
}

export function eventInquiryMessage(params: {
  locale: string;
  procedureName: string;
  hospitalName: string;
}): string {
  const { locale, procedureName, hospitalName } = params;
  if (locale === "ko") {
    return `[Beautiro] 제휴 병원 추가 할인 문의\n병원: ${hospitalName}\n시술: ${procedureName}\n\n할인 조건과 패키지 안내 부탁드립니다.`;
  }
  if (locale === "id") {
    return `[Beautiro] Diskon tambahan mitra\nKlinik: ${hospitalName}\nProsedur: ${procedureName}\n\nMohon info diskon dan paket.`;
  }
  return `[Beautiro] Partner hospital discount inquiry\nClinic: ${hospitalName}\nProcedure: ${procedureName}\n\nPlease share discount details and packages.`;
}
