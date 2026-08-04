import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import {
  createSession,
  setSessionCookie,
} from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/user";

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

    const { token, expiresAt } = await createSession(user.id);
    const response = NextResponse.json({ user: toPublicUser(user) });
    setSessionCookie(response, token, expiresAt);
    return response;
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
