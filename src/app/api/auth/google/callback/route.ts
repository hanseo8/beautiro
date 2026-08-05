import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  exchangeGoogleCode,
  fetchGoogleProfile,
  siteUrl,
} from "@/lib/auth/google";
import { buildAuthResponse } from "@/lib/auth/session";
import {
  OAUTH_LOCALE_COOKIE,
  OAUTH_RETURN_COOKIE,
  OAUTH_STATE_COOKIE,
} from "@/lib/auth/oauth-state";

function redirectWithError(locale: string, code: string) {
  return NextResponse.redirect(
    `${siteUrl()}/${locale}/book?tab=account&error=${code}`,
  );
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const savedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  const locale = cookieStore.get(OAUTH_LOCALE_COOKIE)?.value ?? "en";
  const returnTo = cookieStore.get(OAUTH_RETURN_COOKIE)?.value ?? `/${locale}/book?tab=account`;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError || !code || !state || !savedState || state !== savedState) {
    return redirectWithError(locale, "google");
  }

  try {
    const accessToken = await exchangeGoogleCode(code);
    const profile = await fetchGoogleProfile(accessToken);

    if (!profile.email) {
      return redirectWithError(locale, "google");
    }

    const email = profile.email.toLowerCase();
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: profile.name?.trim() || email.split("@")[0] || "Beautiro User",
          locale,
          emailVerified: profile.verified_email ? new Date() : null,
        },
      });
    } else if (profile.verified_email && !user.emailVerified) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    }

    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: profile.id,
        },
      },
      update: { userId: user.id },
      create: {
        userId: user.id,
        provider: "google",
        providerAccountId: profile.id,
      },
    });

    const authResponse = await buildAuthResponse(user, request);
    const destination = returnTo.startsWith("http")
      ? returnTo
      : `${siteUrl()}${returnTo.startsWith("/") ? returnTo : `/${returnTo}`}`;

    const redirect = NextResponse.redirect(destination);
    const sessionCookie = authResponse.cookies.get("beautiro_session");
    if (sessionCookie) {
      redirect.cookies.set(sessionCookie);
    }

    redirect.cookies.set(OAUTH_STATE_COOKIE, "", { path: "/", maxAge: 0 });
    redirect.cookies.set(OAUTH_LOCALE_COOKIE, "", { path: "/", maxAge: 0 });
    redirect.cookies.set(OAUTH_RETURN_COOKIE, "", { path: "/", maxAge: 0 });

    return redirect;
  } catch (error) {
    console.error("[google:callback]", error);
    return redirectWithError(locale, "google");
  }
}
