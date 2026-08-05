import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

const bodySchema = z.object({
  locale: z.enum(["id", "en", "ko"]),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(6).optional(),
  hospitalName: z.string().optional(),
  procedureName: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().min(20),
  instagramHandle: z.string().optional(),
  visitMonth: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request);
    const json: unknown = await request.json();
    const data = bodySchema.parse(json);

    const review = await prisma.patientReview.create({
      data: {
        locale: data.locale,
        userId: sessionUser?.id ?? null,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        hospitalName: data.hospitalName,
        procedureName: data.procedureName,
        rating: data.rating,
        reviewText: data.reviewText,
        instagramHandle: data.instagramHandle,
        visitMonth: data.visitMonth,
      },
    });

    return NextResponse.json({ id: review.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
