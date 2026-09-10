/** Display / tel contact (separate from WhatsApp). Digits or formatted. */
export const CONTACT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "070-000-0000";

/** Display format for concierge contact. */
export function formatPhoneDisplay(number = CONTACT_PHONE): string {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("070") && digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.startsWith("82") && digits.length >= 11) {
    const local = digits.slice(2);
    return `+82 ${local.slice(0, 2)}-${local.slice(2, 6)}-${local.slice(6)}`;
  }
  if (number.includes("-")) return number;
  return digits ? `+${digits}` : number;
}

export function phoneTelHref(number = CONTACT_PHONE): string {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `tel:${digits}`;
  }
  return `tel:+${digits}`;
}
