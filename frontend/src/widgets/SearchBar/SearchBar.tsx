"use client";

import { useState } from "react";
import { useSearchStore } from "@/features/property-search/stores/search.store";
import { useAutocomplete } from "@/features/property-search/hooks/useAutocomplete";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/components/Button/Button";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

interface SearchBarProps {
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ compact = false }) => {
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const filters = useSearchStore((s) => s.filters);
  const setFilters = useSearchStore((s) => s.setFilters);
  const { suggestions } = useAutocomplete();
  const router = useRouter();

  const handleSearch = () => {
    setFilters({
      ...filters,
      location: {
        city: query,
        country: undefined,
        geoPoint: undefined,
      },
      radius: radius,
    });
    router.push("/search");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={`${compact ? "p-1" : "p-2"} bg-white rounded-2xl shadow-2xl`}
    >
      <div className={`flex flex-col md:flex-row gap-2`}>
        {/* Type de transaction */}
        <select
          className={`p-3 rounded-xl bg-primary-50 text-primary-900 border-0 focus:ring-2 focus:ring-accent font-medium ${compact ? "text-sm" : ""}`}
          value={filters.transactionType || "sale"}
          onChange={(e) =>
            setFilters({
              ...filters,
              transactionType: e.target.value as "sale" | "rent",
            })
          }
        >
          <option value="sale">🏠 Acheter</option>
          <option value="rent">🔑 Louer</option>
        </select>

        {/* Recherche textuelle avec autocomplete */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Pays, ville, quartier ou adresse..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full p-3 rounded-xl bg-primary-50 text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent ${compact ? "text-sm" : ""}`}
          />
          {suggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white w-full mt-2 rounded-xl shadow-card max-h-60 overflow-auto border border-primary-100">
              {suggestions.map((item: any, idx: number) => (
                <li
                  key={idx}
                  onClick={() => {
                    setQuery(item.title || item.text);
                    setFilters({
                      ...filters,
                      location: {
                        ...filters.location,
                        city: item.title || item.text,
                      },
                    });
                    router.push("/search");
                  }}
                  className="px-4 py-3 hover:bg-primary-50 cursor-pointer flex items-center gap-2"
                >
                  <MapPinIcon className="h-4 w-4 text-primary-400" />
                  <span className="text-primary-900">
                    {item.title || item.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rayon */}
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className={`p-3 rounded-xl bg-primary-50 text-primary-900 border-0 focus:ring-2 focus:ring-accent font-medium ${compact ? "text-sm" : ""}`}
        >
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={20}>20 km</option>
          <option value={50}>50 km</option>
          <option value={100}>100 km</option>
        </select>

        {/* Bouton recherche */}
        <Button
          onClick={handleSearch}
          variant="primary"
          size={compact ? "md" : "lg"}
          className="shrink-0 rounded-xl px-6"
        >
          <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
          {!compact && "Rechercher"}
        </Button>

        {/* Filtres avancés (optionnel) */}
        {!compact && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 rounded-xl bg-primary-50 text-primary-500 hover:bg-primary-100 transition-colors"
            title="Filtres avancés"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filtres rapides intégrés (prix, surface) */}
      {showFilters && (
        <div className="mt-4 p-4 bg-primary-50 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <div>
            <label className="text-xs text-primary-500 block mb-1">
              Surface min
            </label>
            <input
              type="number"
              placeholder="0 m²"
              className="w-full p-2 rounded-lg bg-white border border-primary-200 text-sm"
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setFilters({
                  ...filters,
                  features: {
                    ...filters.features,
                    squareMeters: {
                      ...(filters.features?.squareMeters || {}),
                      min: val,
                    },
                  },
                });
              }}
            />
          </div>
          <div>
            <label className="text-xs text-primary-500 block mb-1">
              Surface max
            </label>
            <input
              type="number"
              placeholder="500 m²"
              className="w-full p-2 rounded-lg bg-white border border-primary-200 text-sm"
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setFilters({
                  ...filters,
                  features: {
                    ...filters.features,
                    squareMeters: {
                      ...(filters.features?.squareMeters || {}),
                      max: val,
                    },
                  },
                });
              }}
            />
          </div>
          <div>
            <label className="text-xs text-primary-500 block mb-1">
              Prix min
            </label>
            <input
              type="number"
              placeholder="0 €"
              className="w-full p-2 rounded-lg bg-white border border-primary-200 text-sm"
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setFilters({
                  ...filters,
                  priceRange: {
                    ...filters.priceRange,
                    min: val,
                  },
                });
              }}
            />
          </div>
          <div>
            <label className="text-xs text-primary-500 block mb-1">
              Prix max
            </label>
            <input
              type="number"
              placeholder="1 000 000 €"
              className="w-full p-2 rounded-lg bg-white border border-primary-200 text-sm"
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setFilters({
                  ...filters,
                  priceRange: {
                    ...filters.priceRange,
                    max: val,
                  },
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
