import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://luxhorizon.com", lastModified: new Date() },
    { url: "https://luxhorizon.com/search", lastModified: new Date() },
    { url: "https://luxhorizon.com/agents", lastModified: new Date() },
    { url: "https://luxhorizon.com/agencies", lastModified: new Date() },
    { url: "https://luxhorizon.com/estimate", lastModified: new Date() },
    { url: "https://luxhorizon.com/contact", lastModified: new Date() },
  ];
}
