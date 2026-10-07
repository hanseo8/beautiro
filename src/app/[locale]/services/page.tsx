import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServicesSection } from "@/components/home/ServicesSection";
import { CategoryPanels } from "@/components/home/CategoryPanels";

export default async function ServicesPage({params}: {params: Promise<{locale: string}>}) {
 const {locale} = await params;
 setRequestLocale(locale);
 const t = await getTranslations("home.faq");
 return <div className="container-babitalk space-y-10 py-8">
  <ServicesSection />
  <CategoryPanels />
  <section id="faq"><h2 className="text-section-title">{t("title")}</h2><dl className="mt-6 grid gap-6 md:grid-cols-3">{(t.raw("items") as {q:string;a:string}[]).map(item => <div key={item.q} className="card-modern p-5"><dt className="text-sm font-semibold">{item.q}</dt><dd className="mt-2 text-sm leading-relaxed text-beautiro-muted">{item.a}</dd></div>)}</dl></section>
 </div>;
}
