import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";

function deepMerge(
  base: Record<string, unknown>,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base };
  for (const key of Object.keys(extra)) {
    const baseVal = base[key];
    const extraVal = extra[key];
    if (
      extraVal &&
      typeof extraVal === "object" &&
      !Array.isArray(extraVal) &&
      baseVal &&
      typeof baseVal === "object" &&
      !Array.isArray(baseVal)
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        extraVal as Record<string, unknown>,
      );
    } else if (extraVal !== undefined) {
      result[key] = extraVal;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const base = (await import(`../messages/${locale}.json`)).default;
  const marketing = (
    await import(`../messages/partials/marketing-${locale}.json`)
  ).default;

  return {
    locale,
    messages: deepMerge(
      base as Record<string, unknown>,
      marketing as Record<string, unknown>,
    ),
  };
});
