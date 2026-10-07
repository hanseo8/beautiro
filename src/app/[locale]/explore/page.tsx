import { setRequestLocale } from "next-intl/server";
import { FaceTreatmentExplorer } from "@/components/FaceTreatmentExplorer";

export default async function ExplorePage({params}: {params: Promise<{locale: string}>}) {
 const {locale} = await params;
 setRequestLocale(locale);
 return <div className="container-babitalk py-8"><FaceTreatmentExplorer /></div>;
}
