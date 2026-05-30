"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    const next = locale === "es" ? "en" : "es";
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
      aria-label="Switch language"
    >
      <span
        className={`transition-opacity duration-200 ${locale === "es" ? "opacity-100" : "opacity-40"}`}
      >
        ES
      </span>
      <span className="text-white/30">|</span>
      <span
        className={`transition-opacity duration-200 ${locale === "en" ? "opacity-100" : "opacity-40"}`}
      >
        EN
      </span>
    </button>
  );
}
