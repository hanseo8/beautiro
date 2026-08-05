import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  deleteSessionByToken,
  resolveSessionToken,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const token = await resolveSessionToken(request);

    if (token) {
      await deleteSessionByToken(token);
    }

    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
