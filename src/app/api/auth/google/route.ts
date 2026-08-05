import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getGoogleAuthUrl, siteUrl } from "@/lib/auth/google";
import {
  OAUTH_LOCALE_COOKIE,
  OAUTH_RETURN_COOKIE,
  OAUTH_STATE_COOKIE,
} from "@/lib/auth/oauth-state";

export async function GET(request: Request) {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({ error: "GOOGLE_NOT_CONFIGURED" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") ?? "en";
    const returnTo = searchParams.get("returnTo") ?? `/${locale}/book?tab=account`;
    const state = randomBytes(16).toString("hex");

    const response = NextResponse.redirect(getGoogleAuthUrl(state));
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 10,
    };

    response.cookies.set(OAUTH_STATE_COOKIE, state, cookieOptions);
    response.cookies.set(OAUTH_LOCALE_COOKIE, locale, cookieOptions);
    response.cookies.set(OAUTH_RETURN_COOKIE, returnTo, cookieOptions);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${siteUrl()}/en/book?tab=account&error=google`);
  }
}
