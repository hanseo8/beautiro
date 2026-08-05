import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import type { PublicUser } from "@/lib/auth/user";

export async function requireAdmin(request: Request): Promise<PublicUser | NextResponse> {
  const user = await getSessionUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  return user;
}

export function isAdminUser(user: PublicUser | null) {
  return user?.role === "ADMIN";
}
