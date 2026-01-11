// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/data-access"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.aladin.co.kr",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "image.aladin.co.kr",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shopping-phinf.pstatic.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bookthumb-phinf.pstatic.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
