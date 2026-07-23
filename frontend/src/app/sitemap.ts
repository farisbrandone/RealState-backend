import { MetadataRoute } from "next";
import { blogPosts } from "@/shared/data/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxhorizon.com";
const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3002/api/v1";

// Régénère le sitemap au plus toutes les heures plutôt qu'à chaque requête
// (le catalogue de biens ne change pas assez vite pour justifier du "no-store").
export const revalidate = 3600;

interface PropertySummary {
  id: string;
  updatedAt: string;
}

interface AgentSummary {
  id: string;
  updatedAt: string;
}

interface AgencySummary {
  id: string;
  updatedAt?: string;
}

async function safeFetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Le backend peut être indisponible au moment de la génération (build,
    // preview) — le sitemap se dégrade alors vers les seules pages statiques
    // plutôt que de faire échouer toute la route.
    return null;
  }
}

async function getPropertyEntries(): Promise<MetadataRoute.Sitemap> {
  const data = await safeFetchJson<{ items: PropertySummary[] }>(
    `${API_GATEWAY_URL}/properties?status=published&limit=5000`,
  );
  return (data?.items ?? []).map((property) => ({
    url: `${SITE_URL}/properties/${property.id}`,
    lastModified: new Date(property.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}

async function getAgentEntries(): Promise<MetadataRoute.Sitemap> {
  const data = await safeFetchJson<{ items: AgentSummary[] }>(
    `${API_GATEWAY_URL}/users/search?userType=AGENT&limit=1000`,
  );
  return (data?.items ?? []).map((agent) => ({
    url: `${SITE_URL}/agents/${agent.id}`,
    lastModified: new Date(agent.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
}

async function getAgencyEntries(): Promise<MetadataRoute.Sitemap> {
  const data = await safeFetchJson<AgencySummary[]>(`${API_GATEWAY_URL}/users/agencies`);
  return (data ?? []).map((agency) => ({
    url: `${SITE_URL}/agencies/${agency.id}`,
    lastModified: agency.updatedAt ? new Date(agency.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
}

function getBlogEntries(): MetadataRoute.Sitemap {
  return blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/agents`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/agencies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/estimate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const [properties, agents, agencies] = await Promise.all([
    getPropertyEntries(),
    getAgentEntries(),
    getAgencyEntries(),
  ]);

  return [...staticPages, ...properties, ...agents, ...agencies, ...getBlogEntries()];
}
