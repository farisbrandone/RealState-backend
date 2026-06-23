import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://luxhorizon.com', lastModified: new Date() },
    { url: 'https://luxhorizon.com/search', lastModified: new Date() },
    { url: 'https://luxhorizon.com/login', lastModified: new Date() },
    // ajouter les propriétés dynamiquement ? Vous pouvez faire un fetch ici si besoin.
  ];
}
