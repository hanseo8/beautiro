import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const reviews = await prisma.patientReview.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });

  return NextResponse.json({
    reviews: reviews.map((review) => ({
      id: review.id,
      status: review.status,
      guestName: review.guestName,
      guestEmail: review.guestEmail,
      procedureName: review.procedureName,
      rating: review.rating,
      reviewText: review.reviewText,
      createdAt: review.createdAt.toISOString(),
      user: review.user,
    })),
  });
}
