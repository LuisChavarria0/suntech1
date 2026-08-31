import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Keep sharp's native libvips binaries out of the serverless bundle.
  serverExternalPackages: ['pdfjs-dist', 'jspdf',"sharp"],
  // `sharp` is a transitive dep of Next (for its image optimizer). On Vercel the
  // image optimizer runs on separate infra, so our route/server functions never
  // need sharp — but the file tracer otherwise copies its ~360 MB of
  // cross-platform libvips binaries into every function. Strip it from all
  // function bundles. No app code imports `sharp`.
  outputFileTracingExcludes: {
    "**": ["node_modules/@img/**", "node_modules/sharp/**"],
    "/api/cotizador/upload": ["node_modules/@img/**", "node_modules/sharp/**"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
