import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import { routing, type Locale } from "@/i18n/routing";
import { SiteShell } from "@/components/SiteShell";
import "../globals.css";

const sans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

/** 네이버 나눔스퀘어 (공식 웹폰트, 로컬 호스팅) */
const nanumSquare = localFont({
  src: [
    {
      path: "../fonts/nanum-square/NanumSquareR.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/nanum-square/NanumSquareB.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/nanum-square/NanumSquareEB.woff",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-nanum-square",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${serif.variable} ${nanumSquare.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-beautiro-charcoal">
        <NextIntlClientProvider messages={messages}>
          <SiteShell>{children}</SiteShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
