import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumeVerificationToken } from "@/lib/auth/tokens";
import { siteUrl } from "@/lib/auth/google";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const locale = searchParams.get("locale") ?? "en";

  if (!token) {
    return NextResponse.redirect(
      `${siteUrl()}/${locale}/auth/verify-email?status=invalid`,
    );
  }

  const user = await consumeVerificationToken(token, "EMAIL_VERIFY");
  if (!user) {
    return NextResponse.redirect(
      `${siteUrl()}/${locale}/auth/verify-email?status=invalid`,
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  return NextResponse.redirect(
    `${siteUrl()}/${locale}/auth/verify-email?status=success`,
  );
}
