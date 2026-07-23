import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxhorizon.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/profile",
        "/messages",
        "/checkout",
        "/favorites",
        "/notifications",
        "/alerts",
        // Panneau d'administration des annonces (voir middleware.ts) — la
        // racine exacte "/properties" seulement, pas "/properties/:id".
        "/properties$",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
