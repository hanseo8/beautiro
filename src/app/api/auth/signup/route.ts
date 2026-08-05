import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { buildAuthResponse } from "@/lib/auth/session";
import { createVerificationToken } from "@/lib/auth/tokens";
import { sendEmail, verificationEmailHtml } from "@/lib/email";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().min(6).optional(),
  locale: z.enum(["id", "en", "ko"]).default("en"),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const data = bodySchema.parse(json);
    const email = data.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "EMAIL_TAKEN" }, { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: data.name.trim(),
        phone: data.phone?.trim() || null,
        locale: data.locale,
      },
    });

    const verifyToken = await createVerificationToken(user.id, "EMAIL_VERIFY");
    await sendEmail({
      to: user.email,
      subject: "Verify your Beautiro email",
      html: verificationEmailHtml(user.name, verifyToken, data.locale),
    }).catch((error) => {
      console.error("[signup:verify-email]", error);
    });

    return buildAuthResponse(user, request);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
