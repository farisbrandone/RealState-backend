"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { propertyApi } from "@/shared/api/endpoints/property.endpoints";
import { Card } from "@/shared/ui/components/Card/Card";
import { Button } from "@/shared/ui/components/Button/Button";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import {
  ArrowsPointingOutIcon,
  HomeIcon,
  MapPinIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

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
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-heading mb-6">Comparateur de biens</h1>
        <p className="text-primary-500 mb-4">
          Ajoutez des biens à comparer depuis les résultats de recherche.
        </p>
        <Link href="/search">
          <Button variant="primary">Rechercher des biens</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading mb-6">
        Comparateur ({properties?.length || 0} biens)
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(propertyIds.length)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div
            className={`grid grid-cols-1 md:grid-cols-${Math.min(properties?.length || 1, 3)} gap-6 min-w-[600px]`}
          >
            {properties?.map((property: any) => (
              <Card key={property.id} className="relative">
                <button
                  onClick={() => removeProperty(property.id)}
                  className="absolute top-2 right-2 text-primary-400 hover:text-red-500"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
                <img
                  src={
                    property.media?.[0]?.url ||
                    "/images/property-placeholder.jpg"
                  }
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-heading text-lg mb-2">{property.title}</h3>
                <p className="text-2xl font-bold text-accent mb-3">
                  {formatPrice(
                    property.listing?.price?.amount,
                    property.listing?.price?.currency,
                  )}
                </p>
                <div className="space-y-2 text-sm text-primary-600">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    {property.address?.city}, {property.address?.country}
                  </div>
                  <div className="flex items-center gap-2">
                    <HomeIcon className="h-4 w-4" />
                    {property.features?.bedrooms} ch. |{" "}
                    {property.features?.bathrooms} sdb
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowsPointingOutIcon className="h-4 w-4" />
                    {property.features?.livingArea?.value}{" "}
                    {property.features?.livingArea?.unit}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
