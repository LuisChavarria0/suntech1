import type { CompanyStat, CompanyValue, NavLink } from "@/lib/types";

export const WHATSAPP_URL = "https://wa.link/5wwvt4";
export const WHATSAPP_NUMBER = "50368241230";

export const CONTACT = {
  phone: "2226-9088",
  whatsapp: "6824-1230",
  email: "ventas@suntechelsalvador.com",
  leadEmail: "creativo@suntechelsalvador.com",
  address: "Residencial Paseo del Prado, Polígono B, Casa 64B, Apopa, San Salvador",
  whatsappUrl: WHATSAPP_URL,
  mapUrl: "https://maps.app.goo.gl/qbpbhNuCGTDrLY2d6",
  mapEmbedUrl: "https://maps.google.com/maps?q=13.775851,-89.190454&output=embed&z=16",
};

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61558303791362&locale=es_LA",
  instagram: "https://www.instagram.com/suntech_sv/?hl=es",
  tiktok: "https://www.tiktok.com/@grupo.suntech?lang=es-419",
  linkedin: "https://www.linkedin.com/company/103158658/",
  youtube: "https://www.youtube.com/@SunTechSV",
};

export const STATS: CompanyStat[] = [
  { value: 10, suffix: "+", label: "Años de experiencia" },
  { value: 109, suffix: "+", label: "Proyectos completados" },
  { value: 3, suffix: "", label: "Líneas de servicio" },
  { value: 100, suffix: "%", label: "Compromiso nacional" },
];

export const VALUES: CompanyValue[] = [
  {
    title: "Colaboración",
    description:
      "Trabajamos junto a nuestros clientes para entender sus necesidades y diseñar soluciones que realmente funcionen para su realidad.",
    icon: "Users",
  },
  {
    title: "Eficiencia",
    description:
      "Optimizamos tiempo, recursos y costos operativos mediante tecnología de punta que maximiza el retorno de inversión.",
    icon: "Zap",
  },
  {
    title: "Desarrollo",
    description:
      "Promovemos el aprendizaje continuo y el crecimiento profesional, tanto en nuestro equipo como en nuestros clientes.",
    icon: "TrendingUp",
  },
];

export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Contacto", href: "/contacto" },
];

export const COMPANY_INFO = {
  name: "Grupo Suntech",
  legalName: "Grupo SunTech S.A. DE C.V.",
  tagline: "Soluciones tecnológicas para un futuro sostenible",
  mission:
    "Ofrecer soluciones a la medida integrando tecnologías que se adaptan a la necesidad de todos nuestros clientes.",
  vision:
    "Revolucionar el acceso a la energía con soluciones sostenibles que promueven un futuro más eficiente para El Salvador.",
  description:
    "Con más de 10 años de experiencia y más de 109 proyectos completados, somos líderes en energía solar, seguridad electrónica y tecnología en El Salvador. Integramos tres áreas estratégicas para ofrecer soluciones completas y personalizadas.",
  logoUrl: "/logos/logo-suntech.png",
  registryNumber: "338052-3",
  nit: "0614-141123-109-1",
};
