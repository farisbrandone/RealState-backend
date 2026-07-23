"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { propertyApi } from "@/shared/api/endpoints/property.endpoints";
import { Button } from "@/shared/ui/components/Button/Button";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import { EmptyState } from "@/shared/ui/components/EmptyState/EmptyState";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import { getMediaUrl } from "@/shared/lib/media/media-url";
import { PROPERTY_TYPES, AMENITIES } from "@/shared/constants/property.constants";
import { ScaleIcon, XCircleIcon, CheckIcon, MinusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Sous-ensemble d'équipements le plus discriminant pour une comparaison —
// toute la liste (30+) noierait le tableau plutôt que d'aider à décider.
const COMPARED_AMENITIES = AMENITIES.slice(0, 8);

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.getAll("ids");
  const [propertyIds, setPropertyIds] = useState<string[]>(initialIds);

  const { data: properties, isLoading } = useQuery({
    queryKey: ["compare", propertyIds],
    queryFn: async () => {
      const results = await Promise.all(
        propertyIds.map((id) => propertyApi.getById(id)),
      );
      return results.map((res) => res.data);
    },
    enabled: propertyIds.length > 0,
  });

  const removeProperty = (id: string) => {
    setPropertyIds((prev) => prev.filter((pid) => pid !== id));
  };

  if (propertyIds.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading mb-6">Comparateur de biens</h1>
        <EmptyState
          icon={<ScaleIcon className="h-9 w-9" />}
          title="Aucun bien à comparer"
          description="Ajoutez des biens à comparer depuis les résultats de recherche."
          action={
            <Link href="/search">
              <Button variant="primary">Rechercher des biens</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const list = properties ?? [];
  const lowestPriceId = list.length
    ? list.reduce((min, p) =>
        p.listing?.price?.amount < min.listing?.price?.amount ? p : min,
      ).id
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-heading">
          Comparateur ({list.length} bien{list.length > 1 ? "s" : ""})
        </h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(propertyIds.length)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-primary-100 bg-surface shadow-card">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-40 border-b border-primary-100 bg-surface p-3 text-left align-bottom font-medium text-primary-500">
                  <span className="sr-only">Caractéristique</span>
                </th>
                {list.map((property) => (
                  <th
                    key={property.id}
                    className="min-w-[220px] border-b border-l border-primary-100 p-3 text-left align-bottom"
                  >
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => removeProperty(property.id)}
                        aria-label={`Retirer ${property.title} de la comparaison`}
                        className="absolute right-0 top-0 text-primary-400 hover:text-red-500"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                      <Link href={`/properties/${property.id}`} className="block pr-6">
                        <img
                          src={
                            getMediaUrl(property.media?.[0]?.url) ||
                            "/images/property-placeholder.jpg"
                          }
                          alt={property.title}
                          className="mb-2 h-28 w-full rounded-lg object-cover"
                        />
                        <span className="line-clamp-2 font-heading text-base text-primary-900 hover:text-accent">
                          {property.title}
                        </span>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-accent/5">
                <td className="sticky left-0 z-10 border-b border-primary-100 bg-inherit p-3 font-medium text-primary-700">
                  Prix
                </td>
                {list.map((property) => (
                  <td
                    key={property.id}
                    className={`border-b border-l border-primary-100 p-3 font-heading text-lg ${
                      property.id === lowestPriceId ? "text-accent" : "text-primary-900"
                    }`}
                  >
                    {formatPrice(
                      property.listing?.price?.amount,
                      property.listing?.price?.currency,
                    )}
                    {property.id === lowestPriceId && list.length > 1 && (
                      <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-dark">
                        Le moins cher
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 z-10 border-b border-primary-100 bg-surface p-3 font-medium text-primary-700">
                  Prix / m²
                </td>
                {list.map((property) => {
                  const area = property.features?.livingArea?.value;
                  const amount = property.listing?.price?.amount;
                  const perSqm = area ? Math.round(amount / area) : null;
                  return (
                    <td key={property.id} className="border-b border-l border-primary-100 p-3">
                      {perSqm
                        ? formatPrice(perSqm, property.listing?.price?.currency)
                        : "—"}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="sticky left-0 z-10 border-b border-primary-100 bg-surface p-3 font-medium text-primary-700">
                  Transaction
                </td>
                {list.map((property) => (
                  <td key={property.id} className="border-b border-l border-primary-100 p-3">
                    {property.listing?.type === "sale" ? "À vendre" : "À louer"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 z-10 border-b border-primary-100 bg-surface p-3 font-medium text-primary-700">
                  Type de bien
                </td>
                {list.map((property) => (
                  <td key={property.id} className="border-b border-l border-primary-100 p-3">
                    {PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label ??
                      formatValue(property.propertyType)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 z-10 border-b border-primary-100 bg-surface p-3 font-medium text-primary-700">
                  Ville
                </td>
                {list.map((property) => (
                  <td key={property.id} className="border-b border-l border-primary-100 p-3">
                    {formatValue(property.address?.city)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 z-10 border-b border-primary-100 bg-surface p-3 font-medium text-primary-700">
                  Chambres
                </td>
                {list.map((property) => (
                  <td key={property.id} className="border-b border-l border-primary-100 p-3">
                    {formatValue(property.features?.bedrooms)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 z-10 border-b border-primary-100 bg-surface p-3 font-medium text-primary-700">
                  Salles de bain
                </td>
                {list.map((property) => (
                  <td key={property.id} className="border-b border-l border-primary-100 p-3">
                    {formatValue(property.features?.bathrooms)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 z-10 border-b border-primary-100 bg-surface p-3 font-medium text-primary-700">
                  Surface habitable
                </td>
                {list.map((property) => (
                  <td key={property.id} className="border-b border-l border-primary-100 p-3">
                    {property.features?.livingArea?.value
                      ? `${property.features.livingArea.value} ${property.features.livingArea.unit ?? "m²"}`
                      : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 z-10 border-b border-primary-100 bg-surface p-3 font-medium text-primary-700">
                  Année de construction
                </td>
                {list.map((property) => (
                  <td key={property.id} className="border-b border-l border-primary-100 p-3">
                    {formatValue(property.features?.yearBuilt)}
                  </td>
                ))}
              </tr>
              {COMPARED_AMENITIES.map(({ key, label }) => (
                <tr key={key}>
                  <td className="sticky left-0 z-10 border-b border-primary-100 bg-surface p-3 font-medium text-primary-700">
                    {label}
                  </td>
                  {list.map((property) => (
                    <td key={property.id} className="border-b border-l border-primary-100 p-3">
                      {property.features?.[key] ? (
                        <CheckIcon className="h-5 w-5 text-green-500" aria-label="Oui" />
                      ) : (
                        <MinusIcon className="h-5 w-5 text-primary-300" aria-label="Non" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
