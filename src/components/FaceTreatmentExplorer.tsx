"use client";

import { useEffect, useId, useState } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import catalog from "@/lib/seranplus-catalog.json";
import { treatmentLabel } from "@/lib/treatment-labels";

const copy = {
 zh: { title: "您想了解哪个部位？", intro: "选择面部部位，了解相关项目。", parts: ["眼部", "鼻部", "额头·眉间", "面颊·法令纹", "唇部", "下巴·轮廓", "皮肤"], select: "相关项目", book: "咨询与预约", clinics: "查看提供机构", note: "此指南帮助您了解项目选择。项目适用性及提供机构需经医生咨询确认。", close: "关闭列表", empty: "暂无相关项目。" },
 th: { title: "คุณสนใจบริเวณใด?", intro: "เลือกบริเวณใบหน้าเพื่อดูหัตถการที่เกี่ยวข้อง", parts: ["ดวงตา", "จมูก", "หน้าผาก·หว่างคิ้ว", "แก้ม·ร่องแก้ม", "ริมฝีปาก", "คาง·กรอบหน้า", "ผิวหน้า"], select: "หัตถการที่เกี่ยวข้อง", book: "ปรึกษาและจอง", clinics: "ดูคลินิกที่ให้บริการ", note: "คู่มือนี้ช่วยให้คุณสำรวจตัวเลือก ความเหมาะสมและคลินิกที่ให้บริการจะได้รับการยืนยันหลังปรึกษาแพทย์", close: "ปิดรายการ", empty: "ยังไม่มีรายการหัตถการ" },
 vi: { title: "Bạn quan tâm đến vùng nào?", intro: "Chọn vùng trên khuôn mặt để xem các dịch vụ liên quan.", parts: ["Mắt", "Mũi", "Trán·giữa hai chân mày", "Má·rãnh mũi má", "Môi", "Cằm·đường viền mặt", "Da"], select: "Dịch vụ liên quan", book: "Tư vấn và đặt lịch", clinics: "Xem cơ sở cung cấp", note: "Hướng dẫn giúp bạn tìm hiểu các lựa chọn. Mức độ phù hợp và cơ sở cung cấp được xác nhận sau khi tư vấn với bác sĩ.", close: "Đóng danh sách", empty: "Chưa có dịch vụ được liệt kê." },
 ko: { title: "어느 부위가 궁금하세요?", intro: "얼굴 부위를 선택하고 관련 시술을 살펴보세요.", parts: ["눈", "코", "이마·미간", "볼·팔자", "입술", "턱·얼굴선", "피부 전체"], select: "관련 시술", book: "상담·예약", clinics: "제공 병원 확인", note: "관심 시술을 찾기 위한 안내입니다. 적합한 시술과 제공 병원은 의료진 상담 후 확정됩니다.", close: "목록 닫기", empty: "등록된 시술이 없습니다." },
 en: { title: "Where would you like to explore?", intro: "Select an area to discover related treatments.", parts: ["Eyes", "Nose", "Forehead", "Cheeks", "Lips", "Jawline", "Skin"], select: "Related treatments", book: "Consult & book", clinics: "Find providers", note: "Explore your interests. Suitability and provider availability are confirmed during medical consultation.", close: "Close list", empty: "No treatments listed." },
 id: { title: "Area mana yang ingin Anda jelajahi?", intro: "Pilih area wajah untuk melihat perawatan terkait.", parts: ["Mata", "Hidung", "Dahi", "Pipi", "Bibir", "Rahang", "Kulit"], select: "Perawatan terkait", book: "Konsultasi & reservasi", clinics: "Cari klinik penyedia", note: "Panduan untuk mengenali pilihan perawatan. Kesesuaian dan klinik penyedia dikonfirmasi saat konsultasi medis.", close: "Tutup daftar", empty: "Belum ada perawatan." },
};
const areas = [
 { key: "eyes", x: 39, y: 38, groups: ["eyes"], keys: ["seranplus-sub02-17", "seranplus-sub02-19"] },
 { key: "nose", x: 50, y: 50, groups: [], keys: ["seranplus-sub02-10"] },
 { key: "forehead", x: 50, y: 26, groups: [], keys: ["seranplus-sub02-02", "seranplus-sub02-13", "seranplus-sub02-14"] },
 { key: "cheeks", x: 31, y: 48, groups: [], keys: ["seranplus-sub02-11", "seranplus-sub02-15", "seranplus-sub02-16"] },
 { key: "lips", x: 50, y: 57, groups: [], keys: ["seranplus-sub02-18"] },
 { key: "jaw", x: 50, y: 68, groups: ["lifting"], keys: ["seranplus-sub02-01", "seranplus-sub02-12"] },
 { key: "skin", x: 69, y: 48, groups: ["skin"], keys: ["seranplus-sub02-03"] },
];

export function FaceTreatmentExplorer() {
 const locale = useLocale();
 const c = copy[locale as keyof typeof copy] ?? copy.id;
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
     <Image src="/face-guide/woman-front.png" alt="" fill sizes="(max-width: 768px) 90vw, 384px" className="object-cover" />
     <svg viewBox="0 0 100 125" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
      {selected === 0 ? <g fill="#174c48" fillOpacity=".06" stroke="#174c48" strokeOpacity=".4" strokeWidth=".3"><ellipse cx="39" cy="47.5" rx="7" ry="3"/><ellipse cx="61" cy="47.5" rx="7" ry="3"/></g> : <ellipse cx={area.x} cy={area.y * 1.25} rx={selected === 6 ? 13 : selected === 5 ? 12 : selected === 2 ? 12 : selected === 4 ? 9 : 6} ry={selected === 1 ? 7 : selected === 6 ? 12 : 4} fill="#174c48" fillOpacity=".06" stroke="#174c48" strokeOpacity=".4" strokeWidth=".3"/>}
     </svg>
     {areas.map((a,i) => <button key={a.key} type="button" onClick={() => choose(i)} aria-label={c.parts[i]} aria-pressed={selected === i} style={{left:`${a.x}%`,top:`${a.y}%`}} className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-beautiro-primary"><span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full border border-white/80 transition-colors ${selected === i ? "bg-beautiro-primary/70" : "bg-beautiro-primary/30 group-hover:bg-beautiro-primary/70"}`}/></button>)}
    </div>
    <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label={c.select}>{areas.map((a,i) => <button key={a.key} type="button" onClick={() => choose(i)} aria-pressed={selected===i} className={`rounded-md border px-3 py-2 text-sm ${selected===i ? "border-beautiro-primary bg-beautiro-primary text-white" : "border-beautiro-border text-beautiro-muted"}`}>{i+1}. {c.parts[i]}</button>)}</div>
   </div>
   <div className={`${open ? "fixed inset-x-0 bottom-0 z-[80] max-h-[75dvh] overflow-y-auto rounded-t-2xl border bg-white p-5 shadow-xl" : "hidden"} md:static md:z-auto md:block md:max-h-none md:rounded-none md:border-0 md:p-0 md:shadow-none`}>
    <div className="flex items-center justify-between gap-3"><div><p className="text-xs text-beautiro-muted">{c.select}</p><h3 className="mt-1 text-xl font-semibold">{c.parts[selected]} <span className="text-sm font-normal text-beautiro-muted">({items.length})</span></h3></div><button type="button" onClick={()=>setOpen(false)} aria-label={c.close} className="flex h-11 w-11 items-center justify-center rounded-md border border-beautiro-border md:hidden"><X size={20}/></button></div>
    <ul className="mt-5 space-y-3">{items.map(item => <li key={item.key} className="rounded-lg border border-beautiro-border p-4"><p className="break-words text-sm font-semibold">{treatmentLabel(item, locale)}</p><div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold"><Link href={`/book?tab=bookings&treatment=${encodeURIComponent(item.key)}`} className="inline-flex min-h-9 items-center gap-1 text-beautiro-primary">{c.book}<ArrowUpRight size={14}/></Link><Link href={`/hospitals?q=${encodeURIComponent(treatmentLabel(item, locale))}`} className="inline-flex min-h-9 items-center text-beautiro-muted">{c.clinics}</Link></div></li>)}</ul>
    {!items.length && <p className="py-8 text-sm text-beautiro-muted">{c.empty}</p>}
    <p className="mt-5 text-xs leading-6 text-beautiro-muted">{c.note}</p>
   </div>
  </div>
  <p className="mt-6 text-xs leading-6 text-beautiro-muted md:hidden">{c.note}</p>
 </section>;
}
