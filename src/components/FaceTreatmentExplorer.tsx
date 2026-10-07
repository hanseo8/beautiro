"use client";

import { useEffect, useId, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import catalog from "@/lib/seranplus-catalog.json";

const copy = {
 ko: { title: "어느 부위가 궁금하세요?", intro: "얼굴 부위를 선택하고 관련 시술을 살펴보세요.", parts: ["눈", "코", "이마·미간", "볼·팔자", "입술", "턱·얼굴선", "피부 전체"], select: "관련 시술", book: "상담·예약", clinics: "제공 병원 확인", note: "관심 시술을 찾기 위한 안내입니다. 적합한 시술과 제공 병원은 의료진 상담 후 확정됩니다.", close: "목록 닫기", empty: "등록된 시술이 없습니다." },
 en: { title: "Where would you like to explore?", intro: "Select an area to discover related treatments.", parts: ["Eyes", "Nose", "Forehead", "Cheeks", "Lips", "Jawline", "Skin"], select: "Related treatments", book: "Consult & book", clinics: "Find providers", note: "Explore your interests. Suitability and provider availability are confirmed during medical consultation.", close: "Close list", empty: "No treatments listed." },
 id: { title: "Area mana yang ingin Anda jelajahi?", intro: "Pilih area wajah untuk melihat perawatan terkait.", parts: ["Mata", "Hidung", "Dahi", "Pipi", "Bibir", "Rahang", "Kulit"], select: "Perawatan terkait", book: "Konsultasi & reservasi", clinics: "Cari klinik penyedia", note: "Panduan untuk mengenali pilihan perawatan. Kesesuaian dan klinik penyedia dikonfirmasi saat konsultasi medis.", close: "Tutup daftar", empty: "Belum ada perawatan." },
};
const areas = [
 { key: "eyes", x: 50, y: 41, groups: ["eyes"], keys: ["seranplus-sub02-17", "seranplus-sub02-19"] },
 { key: "nose", x: 50, y: 53, groups: [], keys: ["seranplus-sub02-10"] },
 { key: "forehead", x: 50, y: 27, groups: [], keys: ["seranplus-sub02-02", "seranplus-sub02-13", "seranplus-sub02-14"] },
 { key: "cheeks", x: 29, y: 55, groups: [], keys: ["seranplus-sub02-11", "seranplus-sub02-15", "seranplus-sub02-16"] },
 { key: "lips", x: 50, y: 66, groups: [], keys: ["seranplus-sub02-18"] },
 { key: "jaw", x: 50, y: 78, groups: ["lifting"], keys: ["seranplus-sub02-01", "seranplus-sub02-12"] },
 { key: "skin", x: 72, y: 55, groups: ["skin"], keys: ["seranplus-sub02-03"] },
];

export function FaceTreatmentExplorer() {
 const locale = useLocale();
 const c = copy[locale as keyof typeof copy] ?? copy.id;
 const name = locale === "ko" ? "nameKo" : locale === "id" ? "nameId" : "nameEn";
 const [selected, setSelected] = useState(0);
 const [open, setOpen] = useState(false);
 useEffect(() => {
  if (!open) return;
  const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
  window.addEventListener("keydown", close);
  return () => window.removeEventListener("keydown", close);
 }, [open]);
 const id = useId().replace(/:/g, "");
 const area = areas[selected];
 const items = catalog.groups.flatMap(g => g.items.filter(item => area.groups.includes(g.key) || area.keys.includes(item.key)));
 function choose(index: number) { setSelected(index); setOpen(true); }
 return <section id="face-explorer" aria-labelledby={`${id}-title`} className="min-w-0 rounded-2xl border border-beautiro-border bg-white p-5 sm:p-8">
  <p className="text-label text-beautiro-primary">BEAUTIRO · FACE GUIDE</p>
  <h2 id={`${id}-title`} className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{c.title}</h2>
  <p className="mt-3 text-sm leading-6 text-beautiro-muted">{c.intro}</p>
  <div className="mt-7 grid min-w-0 gap-7 md:grid-cols-2">
   <div>
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl bg-[#f5f5f0]">
     <svg viewBox="0 0 400 500" aria-hidden="true" className="h-full w-full">
      <defs><radialGradient id={`${id}-skin`} cx="38%" cy="35%" r="70%"><stop stopColor="#fbf6ed"/><stop offset=".6" stopColor="#e0d5c5"/><stop offset="1" stopColor="#ad9f8d"/></radialGradient><linearGradient id={`${id}-neck`}><stop stopColor="#c5b8a7"/><stop offset=".5" stopColor="#eee7db"/><stop offset="1" stopColor="#c5b8a7"/></linearGradient></defs>
      <ellipse cx="200" cy="469" rx="135" ry="17" fill="#174c48" opacity=".07"/>
      <path d="M150 360L149 402Q125 419 85 434L75 470H325L315 434Q275 419 251 402L250 360" fill={`url(#${id}-neck)`}/>
      <ellipse cx="97" cy="242" rx="13" ry="32" fill="#c6b9a8"/><ellipse cx="303" cy="242" rx="13" ry="32" fill="#c6b9a8"/>
      <path d="M200 68C127 68 99 118 99 199C99 278 121 344 163 379Q200 412 237 379C279 344 301 278 301 199C301 118 273 68 200 68Z" fill={`url(#${id}-skin)`}/>
      <path d="M120 193Q144 181 170 193M230 193Q256 181 280 193" fill="none" stroke="#887f73" strokeWidth="3" strokeLinecap="round"/>
      <path d="M120 207Q145 192 172 207Q145 219 120 207M228 207Q255 192 280 207Q255 219 228 207" fill="#f8f5ef" stroke="#aa9e8f" strokeWidth="2"/>
      <ellipse cx="146" cy="206" rx="6" ry="7" fill="#6e746c"/><ellipse cx="254" cy="206" rx="6" ry="7" fill="#6e746c"/>
      <path d="M192 214L181 265Q200 279 219 265L208 214" fill="#c6b7a3" opacity=".45"/><path d="M184 269Q200 279 216 269" fill="none" stroke="#a79987" strokeWidth="2"/>
      <path d="M167 327Q187 313 200 321Q213 313 233 327Q200 349 167 327" fill="#bda092"/><path d="M167 327Q200 331 233 327" fill="none" stroke="#947c70"/>
     </svg>
     {areas.map((a,i) => <button key={a.key} type="button" onClick={() => choose(i)} aria-label={c.parts[i]} aria-pressed={selected === i} style={{left:`${a.x}%`,top:`${a.y}%`}} className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-beautiro-primary ${selected === i ? "border-white bg-beautiro-primary text-white" : "border-white bg-white/90 text-beautiro-primary hover:bg-beautiro-primary hover:text-white"}`}><span className="text-xs font-semibold">{i+1}</span></button>)}
    </div>
    <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label={c.select}>{areas.map((a,i) => <button key={a.key} type="button" onClick={() => choose(i)} aria-pressed={selected===i} className={`rounded-md border px-3 py-2 text-sm ${selected===i ? "border-beautiro-primary bg-beautiro-primary text-white" : "border-beautiro-border text-beautiro-muted"}`}>{i+1}. {c.parts[i]}</button>)}</div>
   </div>
   <div className={`${open ? "fixed inset-x-0 bottom-0 z-[80] max-h-[75dvh] overflow-y-auto rounded-t-2xl border bg-white p-5 shadow-xl" : "hidden"} md:static md:z-auto md:block md:max-h-none md:rounded-none md:border-0 md:p-0 md:shadow-none`}>
    <div className="flex items-center justify-between gap-3"><div><p className="text-xs text-beautiro-muted">{c.select}</p><h3 className="mt-1 text-xl font-semibold">{c.parts[selected]} <span className="text-sm font-normal text-beautiro-muted">({items.length})</span></h3></div><button type="button" onClick={()=>setOpen(false)} aria-label={c.close} className="flex h-11 w-11 items-center justify-center rounded-md border border-beautiro-border md:hidden"><X size={20}/></button></div>
    <ul className="mt-5 space-y-3">{items.map(item => <li key={item.key} className="rounded-lg border border-beautiro-border p-4"><p className="break-words text-sm font-semibold">{item[name]}</p><div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold"><Link href={`/book?tab=bookings&treatment=${encodeURIComponent(item.key)}`} className="inline-flex min-h-9 items-center gap-1 text-beautiro-primary">{c.book}<ArrowUpRight size={14}/></Link><Link href={`/hospitals?q=${encodeURIComponent(item[name])}`} className="inline-flex min-h-9 items-center text-beautiro-muted">{c.clinics}</Link></div></li>)}</ul>
    {!items.length && <p className="py-8 text-sm text-beautiro-muted">{c.empty}</p>}
    <p className="mt-5 text-xs leading-6 text-beautiro-muted">{c.note}</p>
   </div>
  </div>
  <p className="mt-6 text-xs leading-6 text-beautiro-muted md:hidden">{c.note}</p>
 </section>;
}
