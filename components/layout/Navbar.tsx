"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { COMPANY_INFO, WHATSAPP_URL } from "@/lib/data/company";

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/nosotros" },
    { label: t("services"), href: "/servicios" },
    { label: t("projects"), href: "/proyectos" },
    { label: t("contact"), href: "/contacto" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-navy-100">
        <div className="container-tight">
          <div className="flex h-14 md:h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="relative z-10 flex-shrink-0">
              <Image
                src={COMPANY_INFO.logoUrl}
                alt="Grupo Suntech"
                width={560}
                height={168}
                className="h-11 md:h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-navy-800 hover:text-navy-950 hover:bg-navy-50 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + Language switcher */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine inline-flex items-center h-9 px-5 bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md"
              >
                {tc("calc_savings")}
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative z-10 p-2 text-navy-900 rounded-lg hover:bg-navy-50 transition-colors"
              aria-label="Abrir menú"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-navy-900/98 backdrop-blur-xl flex flex-col pt-20 px-6 pb-8"
          >
            <nav className="flex flex-col gap-1 flex-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 text-xl font-semibold text-white/80 hover:text-white border-b border-white/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              <LanguageSwitcher variant="dark" />
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine flex items-center justify-center gap-2 h-14 w-full bg-navy-800 hover:bg-navy-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {tc("quote_whatsapp")}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
