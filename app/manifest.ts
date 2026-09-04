import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Suntech",
    description:
      "Energía solar, seguridad electrónica y tecnología en El Salvador.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0A0F1E",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
