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
