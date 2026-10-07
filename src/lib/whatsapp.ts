/** E.164 without + (default placeholder — set NEXT_PUBLIC_WHATSAPP_NUMBER in .env) */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
  "821077708778";

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function consultMessage(params: {
  locale: string;
  procedureName?: string;
  hospitalName?: string;
  extra?: string;
}): string {
  const { locale, procedureName, hospitalName, extra } = params;
  let base: string;
  if (locale === "ko") {
    base = `[Beautiro] 상담 문의${procedureName ? `\n시술: ${procedureName}` : ""}${hospitalName ? `\n병원: ${hospitalName}` : ""}`;
  } else if (locale === "id") {
    base = `[Beautiro] Konsultasi${procedureName ? `\nProsedur: ${procedureName}` : ""}${hospitalName ? `\nKlinik: ${hospitalName}` : ""}`;
  } else if (["zh", "th", "vi"].includes(locale)) {
    const labels = {
      zh: ["咨询请求", "项目", "医疗机构"],
      th: ["ขอคำปรึกษา", "หัตถการ", "คลินิก"],
      vi: ["Yêu cầu tư vấn", "Dịch vụ", "Cơ sở y tế"],
    }[locale]!;
    base = `[Beautiro] ${labels[0]}${procedureName ? `\n${labels[1]}: ${procedureName}` : ""}${hospitalName ? `\n${labels[2]}: ${hospitalName}` : ""}`;
  } else {
    base = `[Beautiro] Consultation request${procedureName ? `\nProcedure: ${procedureName}` : ""}${hospitalName ? `\nClinic: ${hospitalName}` : ""}`;
  }
  return extra ? `${base}\n${extra}` : base;
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
  if (["zh", "th", "vi"].includes(locale)) {
    const labels = {
      zh: ["合作医疗机构优惠咨询", "医疗机构", "项目", "请告知优惠条件及套餐详情。"],
      th: ["สอบถามโปรโมชั่นคลินิกพันธมิตร", "คลินิก", "หัตถการ", "กรุณาแจ้งเงื่อนไขส่วนลดและรายละเอียดแพ็กเกจ"],
      vi: ["Hỏi ưu đãi tại cơ sở đối tác", "Cơ sở y tế", "Dịch vụ", "Vui lòng cho biết điều kiện ưu đãi và chi tiết gói dịch vụ."],
    }[locale]!;
    return `[Beautiro] ${labels[0]}\n${labels[1]}: ${hospitalName}\n${labels[2]}: ${procedureName}\n\n${labels[3]}`;
  }
  return `[Beautiro] Partner hospital discount inquiry\nClinic: ${hospitalName}\nProcedure: ${procedureName}\n\nPlease share discount details and packages.`;
}
