import type { Metadata } from "next";
import AgentDetailPageClient from "./AgentDetailPageClient";
import { getMediaUrl } from "@/shared/lib/media/media-url";

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3002/api/v1";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxhorizon.com";

interface AgentProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  biography?: string | null;
  position?: string | null;
  company?: string | null;
  city?: string | null;
  country?: string | null;
}

async function fetchAgent(id: string): Promise<AgentProfile | null> {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/users/${id}/profile`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as AgentProfile;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agent = await fetchAgent(id);
  if (!agent) return { title: "Agent introuvable — LuxHorizon" };

  const name = `${agent.firstName} ${agent.lastName}`;
  const description =
    agent.biography?.slice(0, 160) ||
    `${name}${agent.position ? `, ${agent.position}` : ""}${agent.company ? ` chez ${agent.company}` : ""} sur LuxHorizon.`;
  const avatar = getMediaUrl(agent.avatar);

  return {
    title: `${name} — Agent immobilier | LuxHorizon`,
    description,
    alternates: { canonical: `${SITE_URL}/agents/${id}` },
    openGraph: {
      title: name,
      description,
      url: `${SITE_URL}/agents/${id}`,
      type: "profile",
      images: avatar ? [{ url: avatar }] : undefined,
    },
  };
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await fetchAgent(id);

  return (
    <>
      {agent && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: `${agent.firstName} ${agent.lastName}`,
              image: getMediaUrl(agent.avatar) ?? undefined,
              jobTitle: agent.position ?? undefined,
              worksFor: agent.company ? { "@type": "Organization", name: agent.company } : undefined,
              address: agent.city
                ? { "@type": "PostalAddress", addressLocality: agent.city, addressCountry: agent.country }
                : undefined,
              url: `${SITE_URL}/agents/${id}`,
            }),
          }}
        />
      )}
      <AgentDetailPageClient />
    </>
  );
}
