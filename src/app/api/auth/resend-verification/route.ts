import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { createVerificationToken } from "@/lib/auth/tokens";
import { sendEmail, verificationEmailHtml } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    if (user.emailVerified) {
      return NextResponse.json({ ok: true, alreadyVerified: true });
    }

    const record = await prisma.user.findUnique({ where: { id: user.id } });
    if (!record) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const token = await createVerificationToken(record.id, "EMAIL_VERIFY");
    await sendEmail({
      to: record.email,
      subject: "Verify your Beautiro email",
      html: verificationEmailHtml(record.name, token, record.locale),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
