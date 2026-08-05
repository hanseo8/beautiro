import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const [users, bookings, reviews, pendingBookings, pendingReviews] =
    await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.patientReview.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.patientReview.count({ where: { status: "PENDING" } }),
    ]);

  return NextResponse.json({
    stats: {
      users,
      bookings,
      reviews,
      pendingBookings,
      pendingReviews,
    },
  });
}
