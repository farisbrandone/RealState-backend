import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import { withSentryConfig } from "@sentry/nextjs";

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

// Sans SENTRY_AUTH_TOKEN (ex : en local ou en CI sans compte Sentry
// configuré), le plugin désactive silencieusement l'upload des source maps
// plutôt que d'échouer le build.
export default withSentryConfig(withPWA(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: false,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  webpack: { treeshake: { removeDebugLogging: true } },
});
