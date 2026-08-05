import { randomBytes } from "crypto";
import { TokenType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const TOKEN_HOURS: Record<TokenType, number> = {
  EMAIL_VERIFY: 48,
  PASSWORD_RESET: 2,
};

export function createTokenValue() {
  return randomBytes(32).toString("hex");
}

export async function createVerificationToken(userId: string, type: TokenType) {
  await prisma.verificationToken.deleteMany({ where: { userId, type } });

  const token = createTokenValue();
  const expiresAt = new Date(
    Date.now() + TOKEN_HOURS[type] * 60 * 60 * 1000,
  );

  await prisma.verificationToken.create({
    data: { userId, token, type, expiresAt },
  });

  return token;
}

export async function consumeVerificationToken(token: string, type: TokenType) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.type !== type) return null;
  if (record.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return null;
  }

  await prisma.verificationToken.delete({ where: { id: record.id } });
  return record.user;
}
