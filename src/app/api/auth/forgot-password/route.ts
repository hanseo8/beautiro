import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createVerificationToken } from "@/lib/auth/tokens";
import { resetPasswordEmailHtml, sendEmail } from "@/lib/email";

const bodySchema = z.object({
  email: z.string().email(),
  locale: z.enum(["id", "en", "ko"]).optional(),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const data = bodySchema.parse(json);
    const email = data.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (user?.passwordHash) {
      const token = await createVerificationToken(user.id, "PASSWORD_RESET");
      await sendEmail({
        to: user.email,
        subject: "Reset your Beautiro password",
        html: resetPasswordEmailHtml(
          user.name,
          token,
          data.locale ?? user.locale,
        ),
      }).catch(console.error);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
