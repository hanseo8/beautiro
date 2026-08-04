import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  deleteSessionByToken,
  SESSION_COOKIE,
} from "@/lib/auth/session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

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
