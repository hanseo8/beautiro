import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      services: true,
      procedure: true,
      user: { select: { id: true, email: true, name: true } },
    },
  });

  return NextResponse.json({
    bookings: bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      locale: booking.locale,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      preferredDate: booking.preferredDate?.toISOString() ?? null,
      createdAt: booking.createdAt.toISOString(),
      services: booking.services.map((service) => service.type),
      procedure: booking.procedure
        ? {
            nameEn: booking.procedure.nameEn,
            nameKo: booking.procedure.nameKo,
          }
        : null,
      user: booking.user,
    })),
  });
}
