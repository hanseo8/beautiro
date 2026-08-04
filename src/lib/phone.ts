import { WHATSAPP_NUMBER } from "./whatsapp";

/** Display format for concierge contact (E.164 → readable). */
export function formatPhoneDisplay(number = WHATSAPP_NUMBER): string {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("82") && digits.length >= 11) {
    const local = digits.slice(2);
    return `+82 ${local.slice(0, 2)}-${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return `+${digits}`;
}

export function phoneTelHref(number = WHATSAPP_NUMBER): string {
  return `tel:+${number.replace(/\D/g, "")}`;
}
