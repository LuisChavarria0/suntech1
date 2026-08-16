import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { COMPANY_INFO, CONTACT, WHATSAPP_URL, SOCIAL_LINKS } from "@/lib/data/company";
import { SERVICES } from "@/lib/data/services";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "@/components/ui/icons/SocialIcons";

const SOCIALS = [
  { href: SOCIAL_LINKS.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: SOCIAL_LINKS.tiktok, label: "TikTok", Icon: TikTokIcon },
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: SOCIAL_LINKS.youtube, label: "YouTube", Icon: YouTubeIcon },
];

export async function Footer() {
  const t = await getTranslations("footer");
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");
  const th = await getTranslations("contact_page");

  const navLinks = [
    { label: tn("home"), href: "/" },
    { label: tn("about"), href: "/nosotros" },
    { label: tn("services"), href: "/servicios" },
    { label: tn("projects"), href: "/proyectos" },
    { label: tn("contact"), href: "/contacto" },
  ];

  return (
    <footer className="relative bg-navy-950 text-white">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="container-tight py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <Image
                src={COMPANY_INFO.logoUrl}
                alt="Grupo Suntech"
                width={160}
                height={48}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-navy-300 text-sm leading-relaxed max-w-xs">
              {t("description")}
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-2 mt-6 h-12 px-6 bg-navy-800 hover:bg-navy-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {tc("quote")}
            </a>

            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 text-navy-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-navy-300 mb-4">
              {t("company_col")}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-navy-300 mb-4">
              {t("services_col")}
            </h3>
            <ul className="space-y-3">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/servicios/${service.slug}`}
                    className="text-sm text-navy-400 hover:text-white transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-navy-300 mb-4">
              {t("contact_col")}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-start gap-3 text-sm text-navy-400 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 mt-0.5 text-gold-500 shrink-0" />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-navy-400 hover:text-white transition-colors"
                >
                  <WhatsAppIcon className="h-4 w-4 mt-0.5 text-gold-500 shrink-0" />
                  {CONTACT.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-start gap-3 text-sm text-navy-400 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 mt-0.5 text-gold-500 shrink-0" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-navy-400 hover:text-white transition-colors"
                >
                  <MapPin className="h-4 w-4 mt-0.5 text-gold-500 shrink-0" />
                  <span>{CONTACT.address}</span>
                </a>
              </li>
            </ul>

            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-navy-300 mb-2">
                <Clock className="h-3.5 w-3.5 text-gold-500" />
                {th("hours_title")}
              </div>
              <ul className="space-y-1 text-xs text-navy-400">
                <li className="flex justify-between gap-4">
                  <span>{th("hours_weekdays")}</span>
                  <span className="text-navy-300">{th("hours_weekdays_time")}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>{th("hours_saturday")}</span>
                  <span className="text-navy-300">{th("hours_saturday_time")}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>{th("hours_weekend")}</span>
                  <span>{th("hours_weekend_time")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-tight py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-500">
            © {new Date().getFullYear()} Grupo Suntech. {t("copyright")}
          </p>
          <p className="text-xs text-navy-500">{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
