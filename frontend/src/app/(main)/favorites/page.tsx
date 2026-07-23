"use client";

import { PropertyCard } from "@/widgets/PropertyCard/PropertyCard";
import { Button } from "@/shared/ui/components/Button/Button";
import { EmptyState } from "@/shared/ui/components/EmptyState/EmptyState";
import { useFavoritesStore } from "@/features/favorites/stores/favorites.store";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function FavoritesPage() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading mb-8 flex items-center gap-3">
        <HeartSolid className="h-8 w-8 text-red-500" />
        Mes favoris
      </h1>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<HeartIcon className="h-9 w-9" />}
          title="Aucun favori"
          description="Ajoutez des biens à vos favoris en cliquant sur le cœur."
          action={
            <Link href="/search">
              <Button variant="primary">Découvrir des biens</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div key={property.id} className="relative group">
              <PropertyCard property={property} />
              <button
                type="button"
                onClick={() => removeFavorite(property.id)}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Retirer des favoris"
                aria-label="Retirer des favoris"
              >
                <HeartSolid className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
