import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { bookings: true, reviews: true } },
    },
  });

  return NextResponse.json({
    users: users.map((user) => ({
      ...user,
      emailVerified: Boolean(user.emailVerified),
      createdAt: user.createdAt.toISOString(),
    })),
  });
}
