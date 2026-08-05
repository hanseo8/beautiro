import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { consumeVerificationToken } from "@/lib/auth/tokens";

const bodySchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const data = bodySchema.parse(json);

    const user = await consumeVerificationToken(data.token, "PASSWORD_RESET");
    if (!user) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
