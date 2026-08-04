import { NextResponse } from "next/server";
import { z } from "zod";
import { ServiceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  locale: z.enum(["id", "en", "ko"]),
  procedureId: z.string().optional(),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(6),
  arrivalDate: z.string().optional(),
  preferredDate: z.string().optional(),
  notes: z.string().optional(),
  services: z.object({
    van: z.boolean(),
    interpreter: z.boolean(),
    fx: z.boolean(),
  }),
});

function parseDate(value?: string) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim();
    const phone = searchParams.get("phone")?.trim();

    if (!email || !phone || !email.includes("@") || phone.length < 6) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        guestEmail: { equals: email, mode: "insensitive" },
        guestPhone: phone,
      },
      include: {
        services: true,
        procedure: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      bookings: bookings.map((booking) => ({
        id: booking.id,
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
        preferredDate: booking.preferredDate?.toISOString() ?? null,
        arrivalDate: booking.arrivalDate?.toISOString() ?? null,
        services: booking.services.map((service) => ({ type: service.type })),
        procedure: booking.procedure
          ? {
              nameKo: booking.procedure.nameKo,
              nameEn: booking.procedure.nameEn,
              nameId: booking.procedure.nameId,
            }
          : null,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const data = bodySchema.parse(json);

    if (data.procedureId) {
      const exists = await prisma.procedure.findUnique({
        where: { id: data.procedureId },
      });
      if (!exists) {
        return NextResponse.json(
          { error: "Invalid procedure" },
          { status: 400 },
        );
      }
    }

    const serviceRows: { type: ServiceType }[] = [];
    if (data.services.van) serviceRows.push({ type: ServiceType.VAN });
    if (data.services.interpreter)
      serviceRows.push({ type: ServiceType.INTERPRETER });
    if (data.services.fx) serviceRows.push({ type: ServiceType.FX_CARE });

    const booking = await prisma.booking.create({
      data: {
        locale: data.locale,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        arrivalDate: parseDate(data.arrivalDate),
        preferredDate: parseDate(data.preferredDate),
        notes: data.notes,
        procedureId: data.procedureId || null,
        services: {
          create: serviceRows,
        },
      },
    });

    return NextResponse.json({ id: booking.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
