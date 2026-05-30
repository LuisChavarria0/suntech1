import type { Project } from "@/lib/types";

const I = "/images"; // local public/images/

export const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "inyeccion-lourdes-colon",
    title: "Inyección Lourdes Colón",
    description:
      "Sistema fotovoltaico con inyección a la red eléctrica nacional para optimizar el consumo energético en la zona.",
    category: "solar",
    location: "Lourdes Colón",
    image: `${I}/whatsapp-image-2025-01-23-at-19.43.34_b5a75fcb-1.jpg`,
    gallery: [
      `${I}/whatsapp-image-2025-01-23-at-19.43.34_b5a75fcb.jpg`,
      `${I}/whatsapp-image-2025-01-23-at-19.17.31_9f0f3001.jpg`,
    ],
    featured: true,
    year: 2024,
  },
  {
    id: "2",
    slug: "iluminacion-solar-san-juan-opico",
    title: "Iluminación Solar San Juan Opico",
    description:
      "Instalación de sistema de iluminación solar para alumbrado público, mejorando la seguridad vial de la comunidad.",
    category: "solar",
    location: "San Juan Opico",
    image: `${I}/whatsapp-image-2025-01-23-at-19.52.26_00ab1e8c.jpg`,
    gallery: [
      `${I}/sdfds4.jpg`,
      `${I}/456gfh.jpg`,
    ],
    featured: true,
    year: 2024,
  },
  {
    id: "3",
    slug: "inyeccion-santa-ana",
    title: "Inyección Santa Ana",
    description:
      "Proyecto de inyección fotovoltaica a la red en Santa Ana, reduciendo costos energéticos y emisiones de carbono.",
    category: "solar",
    location: "Santa Ana",
    image: `${I}/12312.png`,
    featured: true,
    year: 2024,
  },
  {
    id: "4",
    slug: "inyeccion-sonsonate-3",
    title: "Inyección Sonsonate 3",
    description:
      "Tercer proyecto de inyección solar en Sonsonate, consolidando la presencia de energía renovable en la región.",
    category: "solar",
    location: "Sonsonate",
    image: `${I}/sad32445-2.jpg`,
    gallery: [`${I}/sad32445-1.jpg`],
    featured: false,
    year: 2024,
  },
  {
    id: "5",
    slug: "inyeccion-armenia-sonsonate",
    title: "Inyección Armenia Sonsonate",
    description:
      "Sistema fotovoltaico de inyección a red en Armenia, optimizando el consumo y generando excedentes energéticos.",
    category: "solar",
    location: "Armenia, Sonsonate",
    image: `${I}/asd443.jpg`,
    featured: false,
    year: 2024,
  },
  {
    id: "6",
    slug: "camaras-los-chorros",
    title: "Centro de Monitoreo Los Chorros",
    description:
      "Instalación de sistema CCTV integrado con energía solar y tecnología 5G para monitoreo continuo en Los Chorros.",
    category: "seguridad",
    location: "Los Chorros",
    image: `${I}/whatsapp-image-2025-01-23-at-19.47.32_2a55881c-1.jpg`,
    gallery: [
      `${I}/whatsapp-image-2025-01-23-at-19.47.32_2a55881c.jpg`,
      `${I}/screenshot_1.png`,
      `${I}/sad323.png`,
    ],
    featured: false,
    year: 2024,
  },
  {
    id: "7",
    slug: "inyeccion-sonsonate",
    title: "Inyección Sonsonate",
    description:
      "Proyecto de inyección fotovoltaica a la red eléctrica en Sonsonate para consumo industrial.",
    category: "solar",
    location: "Sonsonate",
    image: `${I}/whatsapp-image-2025-01-23-at-19.47.32_2a55881c-2.jpg`,
    featured: false,
    year: 2023,
  },
  {
    id: "8",
    slug: "inyeccion-sucursal-bermeja",
    title: "Inyección Sucursal Bermeja",
    description:
      "Sistema solar de inyección a red para sucursal comercial en Bermeja, con monitoreo remoto en tiempo real.",
    category: "solar",
    location: "Bermeja",
    image: `${I}/213.jpg`,
    gallery: [`${I}/h66h6.jpg`],
    featured: false,
    year: 2023,
  },
  {
    id: "9",
    slug: "inyeccion-polideportivo-espana",
    title: "Inyección Polideportivo España",
    description:
      "Sistema fotovoltaico instalado en el Polideportivo España (Don Bosco), promoviendo el deporte sostenible.",
    category: "solar",
    location: "Don Bosco, San Salvador",
    image: `${I}/6h66h6.jpg`,
    gallery: [`${I}/6h66h6-1.jpg`],
    featured: false,
    year: 2023,
  },
  {
    id: "10",
    slug: "inyeccion-bulevar-venezuela",
    title: "Inyección Bulevar Venezuela",
    description:
      "Proyecto de energía solar con inyección a la red en Bulevar Venezuela, San Salvador.",
    category: "solar",
    location: "Bulevar Venezuela, San Salvador",
    image: `${I}/whatsapp-image-2025-01-23-at-19.51.01_774efa44-1.jpg`,
    gallery: [
      `${I}/whatsapp-image-2025-01-23-at-19.51.01_774efa44.jpg`,
      `${I}/whatsapp-image-2025-01-23-at-19.51.01_774efa44-2.jpg`,
    ],
    featured: false,
    year: 2023,
  },
  {
    id: "11",
    slug: "camaras-central-abasto-soyapango",
    title: "Cámaras Central Abasto Soyapango",
    description:
      "Instalación de sistema de videovigilancia CCTV en Central de Abasto de Soyapango para seguridad del comercio.",
    category: "seguridad",
    location: "Soyapango",
    image: `${I}/whatsapp-image-2025-01-23-at-19.44.39_8addfd24.jpg`,
    gallery: [`${I}/whatsapp-image-2025-01-23-at-19.44.41_9db06ec1.jpg`],
    featured: false,
    year: 2023,
  },
  {
    id: "12",
    slug: "inyeccion-sonsonate-2",
    title: "Inyección Sonsonate 2",
    description:
      "Segundo proyecto de inyección fotovoltaica en Sonsonate, ampliando la capacidad energética renovable.",
    category: "solar",
    location: "Sonsonate",
    image: `${I}/sda2-1.jpg`,
    featured: false,
    year: 2023,
  },
  {
    id: "13",
    slug: "inyeccion-monserrat",
    title: "Inyección Monserrat",
    description:
      "Sistema fotovoltaico de inyección a red en Monserrat, parte del programa de expansión de energía solar en El Salvador.",
    category: "solar",
    location: "Monserrat",
    image: `${I}/sad32.png`,
    featured: false,
    year: 2023,
  },
];

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectsByCategory(
  category: Project["category"]
): Project[] {
  return PROJECTS.filter((p) => p.category === category);
}
