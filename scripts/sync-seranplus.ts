import { PrismaClient, type MedicalCategory } from "@prisma/client";
import catalog from "../src/lib/seranplus-catalog.json";

const prisma = new PrismaClient();
async function main() {
  const hospital = await prisma.hospital.findUniqueOrThrow({ where: { slug: "seran-plus-plastic" } });
  await prisma.$transaction(async (tx) => {
    await tx.hospital.update({ where: { id: hospital.id }, data: { coverImage: "/hospitals/seran-plus/lobby.jpg" } });
    for (const group of catalog.groups) {
      for (const item of group.items) {
        const existing = await tx.procedure.findFirst({ where: { hospitalId: hospital.id, nameKo: item.nameKo } });
        const data = { nameKo: item.nameKo, nameEn: item.nameEn, nameId: item.nameId, category: item.category as MedicalCategory };
        if (existing) await tx.procedure.update({ where: { id: existing.id }, data });
        else await tx.procedure.create({ data: { id: item.key, hospitalId: hospital.id, ...data } });
      }
    }
  }, { timeout: 60000 });
  console.log(`Synced ${catalog.groups.reduce((n, group) => n + group.items.length, 0)} Seran Plus treatments without deleting existing procedures or bookings.`);
}
main().catch(() => { console.error("Seran Plus catalog sync failed. Check database access."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
