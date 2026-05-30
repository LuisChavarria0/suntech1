export interface Service {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  fullDescription: string;
  icon: string;
  accentColor: "gold" | "electric" | "green";
  features: string[];
  image: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "solar" | "seguridad" | "tecnologia";
  location: string;
  image: string;
  gallery?: string[];
  featured: boolean;
  year: number;
}

export interface CompanyStat {
  value: number;
  suffix: string;
  label: string;
}

export interface CompanyValue {
  title: string;
  description: string;
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
}
