import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  // 'skipWaiting' a été retiré car non supporté ou géré automatiquement par le plugin
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // On valide l'utilisation de Turbopack pour couper l'erreur précédente
  //turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: "https", // TypeScript valide maintenant le type littéral 'https'
        hostname: "cdn.example.com",
      },
      {
        protocol: "http", // TypeScript valide maintenant le type littéral 'http'
        hostname: "localhost",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default withPWA(nextConfig);
