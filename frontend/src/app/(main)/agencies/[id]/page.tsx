import type { Metadata } from "next";
import AgencyDetailPageClient from "./AgencyDetailPageClient";

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3002/api/v1";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxhorizon.com";

interface AgencyProfile {
  id: string;
  name: string;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

async function fetchAgency(id: string): Promise<AgencyProfile | null> {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/users/agencies/${id}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as AgencyProfile;
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
  const agency = await fetchAgency(id);
  if (!agency) return { title: "Agence introuvable — LuxHorizon" };

  const description = `${agency.name}${agency.city ? ` — agence immobilière à ${agency.city}` : ""} sur LuxHorizon.`;

  return {
    title: `${agency.name} — Agence immobilière | LuxHorizon`,
    description,
    alternates: { canonical: `${SITE_URL}/agencies/${id}` },
    openGraph: {
      title: agency.name,
      description,
      url: `${SITE_URL}/agencies/${id}`,
      type: "website",
    },
  };
}

export default async function AgencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agency = await fetchAgency(id);

  return (
    <>
      {agency && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: agency.name,
              telephone: agency.phone ?? undefined,
              email: agency.email ?? undefined,
              url: agency.website || `${SITE_URL}/agencies/${id}`,
              address: agency.city
                ? { "@type": "PostalAddress", addressLocality: agency.city, addressCountry: agency.country }
                : undefined,
            }),
          }}
        />
      )}
      <AgencyDetailPageClient />
    </>
  );
}
