import zh from "@/messages/treatments-zh.json";
import th from "@/messages/treatments-th.json";
import vi from "@/messages/treatments-vi.json";
import catalog from "@/lib/seranplus-catalog.json";
import { partnerCopy } from "@/lib/partner-copy";

const translations: Record<string, Record<string, string>> = { zh, th, vi };
type TreatmentLabel = { key: string; nameKo: string; nameEn: string; nameId: string };

export function treatmentLabel(item: TreatmentLabel, locale: string): string {
  return translations[locale]?.[item.key] ??
    (locale === "ko" ? item.nameKo : locale === "id" ? item.nameId : partnerCopy(item.nameEn, locale));
}

export function translatedTreatmentName(item: { nameKo: string; nameEn: string; nameId: string }, locale: string): string {
  const match = catalog.groups.flatMap(group => group.items).find(value =>
    value.nameKo === item.nameKo || value.nameEn === item.nameEn);
  return match ? treatmentLabel(match, locale) :
    (locale === "ko" ? item.nameKo : locale === "id" ? item.nameId : partnerCopy(item.nameEn, locale));
}
