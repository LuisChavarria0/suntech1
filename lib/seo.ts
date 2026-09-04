import type { Metadata } from "next";

export const SITE_URL = "https://www.suntech.com.sv";
export const SITE_NAME = "Grupo Suntech";

export type Locale = "es" | "en";

const OG_LOCALE: Record<Locale, string> = { es: "es_SV", en: "en_US" };

export function absoluteUrl(path = ""): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

/**
 * Canonical + hreflang alternates for a locale-prefixed route. `path` is the
 * route WITHOUT the locale segment — e.g. "" for home, "/nosotros",
 * "/proyectos/slug".
 */
export function localeAlternates(locale: Locale, path = ""): Metadata["alternates"] {
  const clean = path === "/" ? "" : path;
  return {
    canonical: absoluteUrl(`/${locale}${clean}`),
    languages: {
      es: absoluteUrl(`/es${clean}`),
      en: absoluteUrl(`/en${clean}`),
      "x-default": absoluteUrl(`/es${clean}`),
    },
  };
}

/**
 * Builds full page metadata (title, description, canonical/hreflang, Open
 * Graph, Twitter card) for a locale-prefixed route in one call.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  images,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  images?: NonNullable<Metadata["openGraph"]>["images"];
}): Metadata {
  const url = absoluteUrl(`/${locale}${path === "/" ? "" : path}`);
  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url,
      siteName: SITE_NAME,
      title,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
