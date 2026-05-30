import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getLocale } from "next-intl/server";
import { COMPANY_INFO, CONTACT } from "@/lib/data/company";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://suntechsv.com"),
  title: {
    default: "Grupo Suntech | Energía Solar y Tecnología en El Salvador",
    template: "%s | Grupo Suntech",
  },
  description:
    "Líderes en energía solar fotovoltaica, seguridad electrónica y tecnología en El Salvador. Más de 10 años diseñando soluciones a la medida para empresas y hogares.",
  keywords: [
    "energía solar El Salvador",
    "paneles solares San Salvador",
    "sistemas fotovoltaicos",
    "seguridad electrónica El Salvador",
    "CCTV El Salvador",
    "Grupo Suntech",
    "inyección a la red",
    "iluminación solar",
  ],
  authors: [{ name: "Grupo Suntech" }],
  creator: "Grupo Suntech",
  openGraph: {
    type: "website",
    locale: "es_SV",
    url: "https://suntechsv.com",
    siteName: "Grupo Suntech",
    title: "Grupo Suntech | Energía Solar y Tecnología en El Salvador",
    description:
      "Líderes en energía solar fotovoltaica, seguridad electrónica y tecnología en El Salvador.",
    images: [{ url: COMPANY_INFO.logoUrl, width: 1200, height: 630, alt: "Grupo Suntech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grupo Suntech | Energía Solar y Tecnología en El Salvador",
    description:
      "Líderes en energía solar fotovoltaica, seguridad electrónica y tecnología en El Salvador.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: COMPANY_INFO.name,
  description: COMPANY_INFO.description,
  url: "https://suntechsv.com",
  logo: COMPANY_INFO.logoUrl,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Centro Comercial Periplaza Apopa",
    addressLocality: "San Salvador",
    addressRegion: "San Salvador",
    addressCountry: "SV",
  },
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
