/** Exact source matching avoids applying stale translations to edited clinic copy. */
const copy: Record<string, Record<string, string>> = {
  "Partner oriental clinic in Yeonsu-gu, Incheon. Constitution, diet, and pain care with VIP SEA coordination.": {
    zh: "仁川延寿区合作韩医诊所，提供体质、体重管理与疼痛相关护理，并协助东南亚 VIP 客户安排行程。",
    th: "คลินิกการแพทย์แผนเกาหลีพันธมิตรในยอนซูกู อินชอน ให้คำปรึกษาด้านสภาพร่างกาย น้ำหนัก และอาการปวด พร้อมประสานงานลูกค้า VIP จากเอเชียตะวันออกเฉียงใต้",
    vi: "Phòng khám y học cổ truyền Hàn Quốc đối tác tại Yeonsu-gu, Incheon, tư vấn thể trạng, cân nặng và đau, cùng hỗ trợ khách VIP Đông Nam Á.",
  },
  "Partner oriental hospital in Namdong-gu, Incheon. Inpatient integrative care with Van & Mate support.": {
    zh: "仁川南洞区合作韩医医院，提供住院综合护理，并可协调 Beautiro Van 与 Mate 服务。",
    th: "โรงพยาบาลการแพทย์แผนเกาหลีพันธมิตรในนัมดงกู อินชอน ให้การดูแลผู้ป่วยในแบบบูรณาการ พร้อมบริการ Van และ Mate",
    vi: "Bệnh viện y học cổ truyền Hàn Quốc đối tác tại Namdong-gu, Incheon, cung cấp chăm sóc nội trú tích hợp cùng hỗ trợ Van và Mate.",
  },
  "Seran Plus in Guwol-dong, Namdong-gu, Incheon. Custom consults for lifting, liposuction, and body contouring.": {
    zh: "Seran Plus 位于仁川南洞区九月洞，提供紧致提升、吸脂与身体塑形的个性化咨询。",
    th: "Seran Plus ในกูวอลดง นัมดงกู อินชอน ให้คำปรึกษาเฉพาะบุคคลด้านยกกระชับ ดูดไขมัน และปรับรูปร่าง",
    vi: "Seran Plus tại Guwol-dong, Namdong-gu, Incheon, tư vấn cá nhân về nâng cơ, hút mỡ và tạo hình cơ thể.",
  },
  "Seran Dermatology in Guwol-dong, Namdong-gu, Incheon. Premium laser, Botox, and filler packages.": {
    zh: "Seran 皮肤科位于仁川南洞区九月洞，提供激光、肉毒毒素与填充注射项目。",
    th: "Seran Dermatology ในกูวอลดง นัมดงกู อินชอน ให้บริการเลเซอร์ โบท็อกซ์ และฟิลเลอร์",
    vi: "Seran Dermatology tại Guwol-dong, Namdong-gu, Incheon, cung cấp các dịch vụ laser, Botox và filler.",
  },
  "Seran Dental in Guwol-dong, Namdong-gu, Incheon. Implants and cosmetic dentistry with interpreter support.": {
    zh: "Seran 牙科位于仁川南洞区九月洞，提供种植牙与牙齿美容咨询，并可安排口译。",
    th: "Seran Dental ในกูวอลดง นัมดงกู อินชอน ให้บริการรากฟันเทียมและทันตกรรมความงาม พร้อมล่าม",
    vi: "Seran Dental tại Guwol-dong, Namdong-gu, Incheon, cung cấp cấy ghép và nha khoa thẩm mỹ cùng hỗ trợ phiên dịch.",
  },
  "Partner nursing hospital in Dong-gu, Daejeon. Inpatient care and rehabilitation with Beautiro VIP coordination.": {
    zh: "大田东区合作疗养医院，提供住院护理与康复治疗，并由 Beautiro 协助 VIP 客户协调行程。",
    th: "โรงพยาบาลดูแลระยะยาวพันธมิตรในดงกู แทจอน ให้บริการผู้ป่วยในและฟื้นฟูสมรรถภาพ พร้อมการประสานงาน VIP โดย Beautiro",
    vi: "Bệnh viện chăm sóc dài hạn đối tác tại Dong-gu, Daejeon, cung cấp chăm sóc nội trú và phục hồi chức năng cùng hỗ trợ VIP của Beautiro.",
  },
  "Seoul Central Dental in Sangnok-gu, Ansan, Gyeonggi. Orthodontics, cosmetic, and general care with VIP pickup.": {
    zh: "Seoul Central Dental 位于京畿道安山市常绿区，提供正畸、牙齿美容与一般牙科服务，并可协调 VIP 接送。",
    th: "Seoul Central Dental ในซังนกกู อันซาน คย็องกี ให้บริการจัดฟัน ทันตกรรมความงามและทั่วไป พร้อมรถรับส่ง VIP",
    vi: "Seoul Central Dental tại Sangnok-gu, Ansan, Gyeonggi, cung cấp chỉnh nha, nha khoa thẩm mỹ và tổng quát cùng hỗ trợ đưa đón VIP.",
  },
  "Oriental diet consultation": { zh: "韩医体重管理咨询", th: "ปรึกษาการควบคุมน้ำหนักด้วยการแพทย์แผนเกาหลี", vi: "Tư vấn kiểm soát cân nặng bằng y học cổ truyền Hàn Quốc" },
  "Constitution improvement program": { zh: "体质调理项目", th: "โปรแกรมดูแลสภาพร่างกาย", vi: "Chương trình chăm sóc thể trạng" },
  "Integrative oriental treatment consult": { zh: "综合韩医治疗咨询", th: "ปรึกษาการรักษาแบบบูรณาการด้วยการแพทย์แผนเกาหลี", vi: "Tư vấn điều trị tích hợp bằng y học cổ truyền Hàn Quốc" },
  "Eyelid surgery consultation": { zh: "眼部整形咨询", th: "ปรึกษาศัลยกรรมรอบดวงตา", vi: "Tư vấn phẫu thuật vùng mắt" },
  "Rhinoplasty consultation": { zh: "鼻部整形咨询", th: "ปรึกษาศัลยกรรมจมูก", vi: "Tư vấn phẫu thuật mũi" },
  "Facelift consultation": { zh: "面部提升咨询", th: "ปรึกษาการยกกระชับใบหน้า", vi: "Tư vấn nâng cơ mặt" },
  "Botox & filler package": { zh: "肉毒毒素与填充注射套餐", th: "แพ็กเกจโบท็อกซ์และฟิลเลอร์", vi: "Gói Botox và filler" },
  "Dental implant consultation": { zh: "种植牙咨询", th: "ปรึกษารากฟันเทียม", vi: "Tư vấn cấy ghép răng" },
  "Inpatient nursing consultation": { zh: "住院护理咨询", th: "ปรึกษาการดูแลผู้ป่วยใน", vi: "Tư vấn chăm sóc nội trú" },
  "Rehabilitation treatment consultation": { zh: "康复治疗咨询", th: "ปรึกษาการฟื้นฟูสมรรถภาพ", vi: "Tư vấn phục hồi chức năng" },
  "Orthodontics consultation": { zh: "牙齿矫正咨询", th: "ปรึกษาการจัดฟัน", vi: "Tư vấn chỉnh nha" },
  "Cosmetic dentistry consultation": { zh: "牙齿美容咨询", th: "ปรึกษาทันตกรรมความงาม", vi: "Tư vấn nha khoa thẩm mỹ" },
};

export function partnerCopy(source: string, locale: string): string {
  return copy[source]?.[locale] ?? source;
}
