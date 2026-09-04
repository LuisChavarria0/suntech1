import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getLocale, getTranslations } from "next-intl/server";
import { COMPANY_INFO, CONTACT, SOCIAL_LINKS } from "@/lib/data/company";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const KEYWORDS: Record<string, string[]> = {
  es: [
    "energía solar El Salvador",
    "paneles solares San Salvador",
    "sistemas fotovoltaicos",
    "seguridad electrónica El Salvador",
    "CCTV El Salvador",
    "Grupo Suntech",
    "inyección a la red",
    "iluminación solar",
  ],
  en: [
    "solar energy El Salvador",
    "solar panels San Salvador",
    "photovoltaic systems",
    "electronic security El Salvador",
    "CCTV El Salvador",
    "Grupo Suntech",
    "grid injection solar",
    "solar lighting",
  ],
};

// Default/fallback metadata — every route overrides this with its own
// generateMetadata (see lib/seo.ts), but this covers anything that doesn't.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("seo");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("default_title"),
      template: `%s | ${SITE_NAME}`,
    },
    description: t("default_description"),
    keywords: KEYWORDS[locale] ?? KEYWORDS.es,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_SV",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: t("default_title"),
      description: t("default_description"),
      // No explicit images here — app/opengraph-image.tsx (the branded 1200x630
      // card) is picked up automatically by Next's file convention and would
      // otherwise get shadowed by whatever we set at this (the root) segment.
    },
    twitter: {
      card: "summary_large_image",
      title: t("default_title"),
      description: t("default_description"),
    },
    robots: { index: true, follow: true },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: COMPANY_INFO.name,
  legalName: COMPANY_INFO.legalName,
  description: COMPANY_INFO.description,
  url: SITE_URL,
  logo: `${SITE_URL}${COMPANY_INFO.logoUrl}`,
  image: `${SITE_URL}${COMPANY_INFO.logoUrl}`,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Residencial Paseo del Prado, Polígono B, Casa 64B",
    addressLocality: "Apopa",
    addressRegion: "San Salvador",
    addressCountry: "SV",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 13.775851,
    longitude: -89.190454,
  },
  areaServed: {
    "@type": "Country",
    name: "El Salvador",
  },
  sameAs: Object.values(SOCIAL_LINKS),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={jakarta.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
