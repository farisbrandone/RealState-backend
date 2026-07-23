import type { Metadata } from "next";
import PropertyPageClient from "./PropertyPageClient";
import { getMediaUrl } from "@/shared/lib/media/media-url";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import type { PropertyDetail } from "@/features/property-details/types";

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3002/api/v1";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxhorizon.com";

async function fetchProperty(id: string): Promise<PropertyDetail | null> {
  try {
    const res = await fetch(`${API_GATEWAY_URL}/properties/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PropertyDetail;
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
  const property = await fetchProperty(id);
  if (!property) {
    return { title: "Annonce introuvable — LuxHorizon" };
  }

  const title = `${property.title} — ${formatPrice(property.listing.price.amount, property.listing.price.currency)} | LuxHorizon`;
  const description =
    property.description.length > 160
      ? `${property.description.slice(0, 157)}...`
      : property.description;
  const mainImage = getMediaUrl(
    property.media.find((m) => m.isMain)?.url ?? property.media[0]?.url,
  );

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/properties/${id}` },
    openGraph: {
      title: property.title,
      description,
      url: `${SITE_URL}/properties/${id}`,
      type: "website",
      images: mainImage ? [{ url: mainImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description,
      images: mainImage ? [mainImage] : undefined,
    },
  };
}

function buildJsonLd(property: PropertyDetail) {
  const images = property.media
    .map((m) => getMediaUrl(m.url))
    .filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${SITE_URL}/properties/${property.id}`,
    image: images,
    datePosted: property.createdAt,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address.street,
      addressLocality: property.address.city,
      postalCode: property.address.postalCode,
      addressCountry: property.address.country,
    },
    ...(property.address.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.address.coordinates.latitude,
        longitude: property.address.coordinates.longitude,
      },
    }),
    numberOfRooms: property.features.rooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.features.livingArea.value,
      unitText: property.features.livingArea.unit,
    },
    offers: {
      "@type": "Offer",
      price: property.listing.price.amount,
      priceCurrency: property.listing.price.currency,
      availability: "https://schema.org/InStock",
      businessFunction:
        property.listing.type === "rent"
          ? "http://purl.org/goodrelations/v1#LeaseOut"
          : "http://purl.org/goodrelations/v1#Sell",
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await fetchProperty(id);

  return (
    <>
      {property && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(property)) }}
        />
      )}
      <PropertyPageClient />
    </>
  );
}
