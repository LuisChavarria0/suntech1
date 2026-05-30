import type { CompanyStat, CompanyValue, NavLink } from "@/lib/types";

export const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=50371949502&text=Hola%2C%20cont%C3%A1ctanos%20por%20whatsapp";

export const CONTACT = {
  phone: "2103-2919",
  whatsapp: "7194-9502",
  email: "ventas@suntechelsalvador.com",
  address: "Centro Comercial Periplaza Apopa, San Salvador Este, El Salvador",
  whatsappUrl: WHATSAPP_URL,
};

export const STATS: CompanyStat[] = [
  { value: 10, suffix: "+", label: "Años de experiencia" },
  { value: 13, suffix: "+", label: "Proyectos completados" },
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
  tagline: "Soluciones tecnológicas para un futuro sostenible",
  mission:
    "Ofrecer soluciones a la medida integrando tecnologías que se adaptan a la necesidad de todos nuestros clientes.",
  vision:
    "Revolucionar el acceso a la energía con soluciones sostenibles que promueven un futuro más eficiente para El Salvador.",
  description:
    "Con más de 10 años de experiencia, somos líderes en energía solar, seguridad electrónica y tecnología en El Salvador. Integramos tres áreas estratégicas para ofrecer soluciones completas y personalizadas.",
  logoUrl:
    "https://i0.wp.com/suntechsvcom.wpcomstaging.com/wp-content/uploads/2025/01/LOGO-FULL-COLOR-SLOGAN-NEGRO-SIN-FONDO.png",
};
