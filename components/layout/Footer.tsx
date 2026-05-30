import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { COMPANY_INFO, CONTACT, WHATSAPP_URL } from "@/lib/data/company";
import { SERVICES } from "@/lib/data/services";

export async function Footer() {
  const t = await getTranslations("footer");
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");

  const navLinks = [
    { label: tn("home"), href: "/" },
    { label: tn("about"), href: "/nosotros" },
    { label: tn("services"), href: "/servicios" },
    { label: tn("projects"), href: "/proyectos" },
    { label: tn("contact"), href: "/contacto" },
  ];

  return (
    <footer className="bg-navy-950 text-white">
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
              {COMPANY_INFO.description}
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-2 mt-5 h-10 px-5 bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-semibold rounded-xl transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              {tc("quote")}
            </a>
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
                  <MessageCircle className="h-4 w-4 mt-0.5 text-gold-500 shrink-0" />
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
                <div className="flex items-start gap-3 text-sm text-navy-400">
                  <MapPin className="h-4 w-4 mt-0.5 text-gold-500 shrink-0" />
                  <span>{CONTACT.address}</span>
                </div>
              </li>
            </ul>
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
