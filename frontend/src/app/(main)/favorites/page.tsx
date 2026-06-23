"use client";

import { useState, useEffect } from "react";
import { PropertyCard } from "@/widgets/PropertyCard/PropertyCard";
import { Button } from "@/shared/ui/components/Button/Button";
import { HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const FAVORITES_KEY = "luxhorizon_favorites";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const removeFavorite = (propertyId: string) => {
    const updated = favorites.filter((fav) => fav.id !== propertyId);
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading mb-8 flex items-center gap-3">
        <HeartIcon className="h-8 w-8 text-red-500" />
        Mes favoris
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <HeartIcon className="h-16 w-16 text-primary-200 mx-auto mb-4" />
          <h3 className="text-xl font-heading mb-2">Aucun favori</h3>
          <p className="text-primary-500 mb-6">
            Ajoutez des biens à vos favoris en cliquant sur le cœur.
          </p>
          <Link href="/search">
            <Button variant="primary">Découvrir des biens</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div key={property.id} className="relative group">
              <PropertyCard property={property} />
              <button
                onClick={() => removeFavorite(property.id)}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Retirer des favoris"
              >
                <HeartIcon className="h-5 w-5 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
