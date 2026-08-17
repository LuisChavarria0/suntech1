import type { Service } from "@/lib/types";

export const SERVICES: Service[] = [
  {
    id: "1",
    slug: "energia-solar",
    title: "Energía Solar",
    shortTitle: "Solar",
    icon: "Sun",
    accentColor: "gold",
    description:
      "Instalamos sistemas fotovoltaicos residenciales, comerciales e industriales adaptados a tus necesidades energéticas.",
    fullDescription:
      "Somos especialistas en el diseño, instalación y mantenimiento de sistemas de energía solar fotovoltaica en El Salvador. Con más de 10 años de experiencia, hemos implementado proyectos de inyección a la red, iluminación solar y monitoreo energético en todo el territorio nacional. Nuestros sistemas se adaptan a cada cliente: desde hogares hasta grandes instalaciones industriales.",
    features: [
      "Diseño personalizado de sistemas fotovoltaicos",
      "Instalación de paneles solares residencial e industrial",
      "Sistemas de inyección a la red nacional",
      "Iluminación solar para exteriores y vía pública",
      "Centros de monitoreo con tecnología 5G",
      "Mantenimiento preventivo y correctivo",
    ],
    image: "/images/6h66h6.jpg",
  },
  {
    id: "2",
    slug: "seguridad-electronica",
    title: "Seguridad Electrónica",
    shortTitle: "Seguridad",
    icon: "Shield",
    accentColor: "electric",
    description:
      "Sistemas CCTV, centros de monitoreo y videovigilancia con tecnología de punta para proteger tu empresa.",
    fullDescription:
      "Diseñamos e implementamos soluciones integrales de seguridad electrónica para empresas, instituciones y espacios públicos. Nuestros sistemas de videovigilancia combinan hardware de última generación con software inteligente de monitoreo. Integramos cámaras CCTV con energía solar para garantizar operación continua incluso sin conexión a la red eléctrica.",
    features: [
      "Instalación de sistemas CCTV profesional",
      "Centros de monitoreo 24/7",
      "Videovigilancia con analítica de IA",
      "Integración con energía solar",
      "Control de acceso y gestión de visitantes",
      "Soporte técnico y mantenimiento continuo",
    ],
    image: "/images/screenshot_1.png",
  },
  {
    id: "3",
    slug: "tecnologia",
    title: "Tecnología",
    shortTitle: "Tecnología",
    icon: "Cpu",
    accentColor: "green",
    description:
      "Hardware, software y soporte técnico especializado para optimizar las operaciones de tu empresa.",
    fullDescription:
      "Proveemos soluciones tecnológicas completas para empresas salvadoreñas: desde la venta de hardware y equipos hasta la implementación de software especializado y soporte técnico continuo. Nuestro equipo de expertos garantiza que tu infraestructura tecnológica opere de manera óptima y segura, con acompañamiento en cada etapa del proceso.",
    features: [
      "Venta e instalación de hardware empresarial",
      "Implementación de soluciones de software",
      "Soporte técnico especializado on-site y remoto",
      "Consultoría tecnológica estratégica",
      "Infraestructura de redes y comunicaciones",
      "Capacitación y acompañamiento al equipo",
    ],
    image: "/images/whatsapp-image-2025-01-23-at-19.17.31_9f0f3001.jpg",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
