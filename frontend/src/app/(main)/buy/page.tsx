"use client";

import { useSearchStore } from "@/features/property-search/stores/search.store";
import { usePropertySearch } from "@/features/property-search/hooks/usePropertySearch";
import { PropertyCard } from "@/widgets/PropertyCard/PropertyCard";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import { Button } from "@/shared/ui/components/Button/Button";
import { SearchBar } from "@/widgets/SearchBar/SearchBar";
import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const FEATURED_CITIES = [
  { name: "Douala", image: "/images/cities/douala.jpg" },
  { name: "Yaoundé", image: "/images/cities/yaounde.jpg" },
  { name: "Abidjan", image: "/images/cities/abidjan.jpg" },
  { name: "Dakar", image: "/images/cities/dakar.jpg" },
  { name: "Cotonou", image: "/images/cities/cotonou.jpg" },
  { name: "Lomé", image: "/images/cities/lome.jpg" },
];

export default function BuyPage() {
  const results = useSearchStore((s) => s.results);
  const setFilters = useSearchStore((s) => s.setFilters);
  const { isLoading } = usePropertySearch();
  const properties = results?.items || [];

  // Forcer le filtre "achat"
  useState(() => {
    setFilters({ transactionType: "sale" });
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-ink py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            Achetez le bien qui vous correspond
          </h1>
          <p className="text-white/70 mb-8">
            Découvrez notre sélection de biens à vendre partout en Afrique
            francophone
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Villes populaires */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-heading mb-6">Rechercher par ville</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURED_CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/search?city=${city.name}`}
              className="group relative h-32 rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="font-medium">{city.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Biens à vendre */}
      <section className="bg-primary-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-heading mb-6">Biens à vendre</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 9).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              {properties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-primary-500 mb-4">
                    Aucun bien à vendre pour le moment.
                  </p>
                  <Link href="/search">
                    <Button variant="outline">Voir tous les biens</Button>
                  </Link>
                </div>
              )}
              <div className="text-center mt-8">
                <Link href="/search?transactionType=sale">
                  <Button variant="primary" size="lg">
                    Voir tous les biens à vendre
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
