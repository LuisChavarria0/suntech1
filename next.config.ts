import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "suntechsvcom.wpcomstaging.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
