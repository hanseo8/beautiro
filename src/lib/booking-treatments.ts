import catalog from "@/lib/seranplus-catalog.json";

export const sharedTreatments = catalog.groups.flatMap(group => group.items);
const marker = "BEAUTIRO_TREATMENT:";

export function findRequestedTreatment(key: string) {
  return sharedTreatments.find(item => item.key === key);
}

export function requestedTreatmentFromNotes(notes: string | null) {
  if (!notes?.startsWith(marker)) return null;
  const key = notes.slice(marker.length).split("\n")[0];
  const item = findRequestedTreatment(key);
  return item ? { nameKo: item.nameKo, nameEn: item.nameEn, nameId: item.nameId } : null;
}

export function treatmentRequestNotes(key: string, notes?: string) {
  const item = findRequestedTreatment(key);
  if (!item) throw new Error("Invalid requested treatment");
  return `${marker}${key}\nRequested treatment: ${item.nameEn} / ${item.nameKo}\nHospital assignment: confirm during consultation\n${notes ?? ""}`;
}
