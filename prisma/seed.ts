import { PrismaClient, MedicalCategory } from "@prisma/client";
import { KOREA_IMAGES } from "../src/lib/media";

const prisma = new PrismaClient();

async function main() {
  await prisma.bookingService.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.procedure.deleteMany();
  await prisma.hospital.deleteMany();

  const partners = [
    {
      slug: "arena-oriental-clinic",
      nameKo: "아레나 한의원",
      nameEn: "Arena Oriental Clinic",
      nameId: "Klinik Oriental Arena",
      descriptionKo:
        "인천 제휴 한의원. 체질·다이어트·통증 케어, 동남아 VIP 전담 상담 연계.",
      descriptionEn:
        "Partner oriental clinic in Incheon. Constitution, diet, and pain care with VIP SEA coordination.",
      descriptionId:
        "Klinik oriental mitra di Incheon. Perawatan konstitusi, diet, dan nyeri dengan koordinator VIP ASEAN.",
      city: "Incheon",
      district: "Namdong",
      coverImage: KOREA_IMAGES.seoulKMediCenter,
      featured: true,
      procedures: [
        {
          category: MedicalCategory.ORIENTAL,
          nameKo: "한방 다이어트 상담",
          nameEn: "Oriental diet consultation",
          nameId: "Konsultasi diet oriental",
          priceFrom: 890000,
          durationMin: 60,
        },
        {
          category: MedicalCategory.ORIENTAL,
          nameKo: "체질 개선 프로그램",
          nameEn: "Constitution improvement program",
          nameId: "Program perbaikan konstitusi",
          priceFrom: 1200000,
          durationMin: 90,
        },
      ],
    },
    {
      slug: "arena-oriental-hospital",
      nameKo: "아레나 한방병원",
      nameEn: "Arena Oriental Hospital",
      nameId: "Rumah Sakit Oriental Arena",
      descriptionKo:
        "인천 제휴 한방병원. 입원·통합 한방 치료, Beautiro Van·Mate 연계 가능.",
      descriptionEn:
        "Partner oriental hospital in Incheon. Inpatient integrative care with Van & Mate support.",
      descriptionId:
        "Rumah sakit oriental mitra di Incheon. Perawatan integratif rawat inap dengan dukungan Van & Mate.",
      city: "Incheon",
      district: "Namdong",
      coverImage: KOREA_IMAGES.hanyakTraditionalMedicine,
      featured: true,
      procedures: [
        {
          category: MedicalCategory.ORIENTAL,
          nameKo: "한방 통합 치료 상담",
          nameEn: "Integrative oriental treatment consult",
          nameId: "Konsultasi pengobatan oriental integratif",
          priceFrom: 1500000,
          durationMin: 90,
        },
      ],
    },
    {
      slug: "seran-plastic",
      nameKo: "세란성형외과",
      nameEn: "Seran Plastic Surgery",
      nameId: "Seran Plastic Surgery",
      descriptionKo: "인천 세란성형외과. 눈·코·안면윤곽 VIP 상담 및 수술 패키지.",
      descriptionEn:
        "Seran Plastic Surgery in Incheon. VIP consults for eyes, nose, and facial contouring.",
      descriptionId:
        "Seran Plastic Surgery di Incheon. Konsultasi VIP untuk mata, hidung, dan kontur wajah.",
      city: "Incheon",
      district: "Bupyeong",
      coverImage: KOREA_IMAGES.soonchunhyangSeoulHospital,
      featured: true,
      procedures: [
        {
          category: MedicalCategory.PLASTIC,
          nameKo: "눈 성형 상담",
          nameEn: "Eyelid surgery consultation",
          nameId: "Konsultasi operasi kelopak mata",
          priceFrom: 2200000,
          durationMin: 60,
        },
        {
          category: MedicalCategory.PLASTIC,
          nameKo: "코 성형 상담",
          nameEn: "Rhinoplasty consultation",
          nameId: "Konsultasi rhinoplasty",
          priceFrom: 3500000,
          durationMin: 60,
        },
      ],
    },
    {
      slug: "seran-plus-plastic",
      nameKo: "세란플러스성형외과",
      nameEn: "Seran Plus Plastic Surgery",
      nameId: "Seran Plus Plastic Surgery",
      descriptionKo:
        "인천 세란플러스성형외과. 리프팅·지방흡입·바디 라인 맞춤 상담.",
      descriptionEn:
        "Seran Plus in Incheon. Custom consults for lifting, liposuction, and body contouring.",
      descriptionId:
        "Seran Plus di Incheon. Konsultasi khusus untuk lifting, sedot lemak, dan kontur tubuh.",
      city: "Incheon",
      district: "Bupyeong",
      coverImage: KOREA_IMAGES.asanMedicalCenter,
      featured: true,
      procedures: [
        {
          category: MedicalCategory.PLASTIC,
          nameKo: "리프팅 상담",
          nameEn: "Facelift consultation",
          nameId: "Konsultasi facelift",
          priceFrom: 4500000,
          durationMin: 75,
        },
      ],
    },
    {
      slug: "seran-dermatology",
      nameKo: "세란피부과",
      nameEn: "Seran Dermatology",
      nameId: "Seran Dermatology",
      descriptionKo: "인천 세란피부과. 레이저·보톡스·필러 프리미엄 시술 패키지.",
      descriptionEn:
        "Seran Dermatology in Incheon. Premium laser, Botox, and filler packages.",
      descriptionId:
        "Seran Dermatology di Incheon. Paket premium laser, Botox, dan filler.",
      city: "Incheon",
      district: "Bupyeong",
      coverImage: KOREA_IMAGES.konkukUniversityHospital,
      featured: true,
      procedures: [
        {
          category: MedicalCategory.DERMATOLOGY,
          nameKo: "보톡스·필러 패키지",
          nameEn: "Botox & filler package",
          nameId: "Paket Botox & filler",
          priceFrom: 450000,
          durationMin: 45,
        },
        {
          category: MedicalCategory.DERMATOLOGY,
          nameKo: "레이저 토닝",
          nameEn: "Laser toning",
          nameId: "Laser toning",
          priceFrom: 280000,
          durationMin: 40,
        },
      ],
    },
    {
      slug: "seran-dental",
      nameKo: "세란치과",
      nameEn: "Seran Dental Clinic",
      nameId: "Klinik Gigi Seran",
      descriptionKo: "인천 세란치과. 임플란트·심미 치료, 통역 동행 상담 연계.",
      descriptionEn:
        "Seran Dental in Incheon. Implants and cosmetic dentistry with interpreter support.",
      descriptionId:
        "Seran Dental di Incheon. Implan dan estetika gigi dengan pendamping penerjemah.",
      city: "Incheon",
      district: "Bupyeong",
      coverImage: KOREA_IMAGES.konkukUniversityHospital,
      featured: false,
      procedures: [
        {
          category: MedicalCategory.DENTAL,
          nameKo: "임플란트 상담",
          nameEn: "Dental implant consultation",
          nameId: "Konsultasi implan gigi",
          priceFrom: 1800000,
          durationMin: 60,
        },
      ],
    },
    {
      slug: "seoul-central-dental",
      nameKo: "서울중앙치과",
      nameEn: "Seoul Central Dental",
      nameId: "Seoul Central Dental",
      descriptionKo: "안산 서울중앙치과. 교정·심미·일반 진료, VIP 픽업 연계 가능.",
      descriptionEn:
        "Seoul Central Dental in Ansan. Orthodontics, cosmetic, and general care with VIP pickup.",
      descriptionId:
        "Seoul Central Dental di Ansan. Ortodonti, estetika, dan perawatan umum dengan pickup VIP.",
      city: "Ansan",
      district: "Sangnok-gu",
      coverImage: KOREA_IMAGES.konkukUniversityHospital,
      featured: false,
      procedures: [
        {
          category: MedicalCategory.DENTAL,
          nameKo: "치아 교정 상담",
          nameEn: "Orthodontics consultation",
          nameId: "Konsultasi ortodonti",
          priceFrom: 3500000,
          durationMin: 60,
        },
        {
          category: MedicalCategory.DENTAL,
          nameKo: "심미 치료 상담",
          nameEn: "Cosmetic dentistry consultation",
          nameId: "Konsultasi estetika gigi",
          priceFrom: 890000,
          durationMin: 45,
        },
      ],
    },
  ];

  for (const partner of partners) {
    const { procedures, ...hospital } = partner;
    await prisma.hospital.create({
      data: {
        ...hospital,
        procedures: { create: procedures },
      },
    });
  }

  console.log(`Seeded ${partners.length} partner hospitals`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
