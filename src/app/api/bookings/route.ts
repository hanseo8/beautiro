import { NextResponse } from "next/server";
import { z } from "zod";
import { ServiceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

const dateSchema = z.string().refine(value => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Invalid date").optional();

const bodySchema = z.object({
  locale: z.enum(["id", "en", "ko"]),
  procedureId: z.string().optional(),
  guestName: z.string().trim().min(2),
  guestEmail: z.string().trim().email(),
  guestPhone: z.string().trim().min(6),
  arrivalDate: dateSchema,
  preferredDate: dateSchema,
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
    const sessionUser = await getSessionUser(request);
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim();
    const phone = searchParams.get("phone")?.trim();

    if (sessionUser) {
      const bookings = await prisma.booking.findMany({
        where: { userId: sessionUser.id },
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
    }

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
    const sessionUser = await getSessionUser(request);
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
        userId: sessionUser?.id ?? null,
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
    if (e instanceof z.ZodError || e instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
