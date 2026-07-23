"use client";

import { useState } from "react";
import { useSearchStore } from "@/features/property-search/stores/search.store";
import { Button } from "@/shared/ui/components/Button/Button";
import {
  PROPERTY_TYPES,
  AMENITIES,
  EXTRA_FEATURES,
} from "@/shared/constants/property.constants";
import { propertyApi } from "@/shared/api/endpoints/property.endpoints";

export const FiltersPanel = () => {
  const filters = useSearchStore((s) => s.filters);
  const setFilters = useSearchStore((s) => s.setFilters);

  const [priceMin, setPriceMin] = useState<number | undefined>(
    filters.priceRange?.min,
  );
  const [priceMax, setPriceMax] = useState<number | undefined>(
    filters.priceRange?.max,
  );
  const [surfaceMin, setSurfaceMin] = useState<number | undefined>();
  const [surfaceMax, setSurfaceMax] = useState<number | undefined>();
  const [bedrooms, setBedrooms] = useState<number | undefined>();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    filters.propertyType || [],
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      transactionType: filters.transactionType,
      propertyType: selectedTypes.length > 0 ? selectedTypes : undefined,
      priceRange: {
        min: priceMin,
        max: priceMax,
        currency: "XAF",
      },
      features: {
        ...filters.features,
        bedrooms: bedrooms,
        squareMetersMin: surfaceMin,
        squareMetersMax: surfaceMax,
        ...Object.fromEntries(selectedAmenities.map((a) => [a, true])),
        ...Object.fromEntries(selectedExtras.map((e) => [e, true])),
      },
    });
  };

  const handleReset = () => {
    setPriceMin(undefined);
    setPriceMax(undefined);
    setSurfaceMin(undefined);
    setSurfaceMax(undefined);
    setBedrooms(undefined);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSelectedExtras([]);
    setFilters({});
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Type de bien */}
      <div>
        <h3 className="font-medium text-primary-900 mb-3">Type de bien</h3>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.value)}
                onChange={() => toggleType(type.value)}
                className="rounded border-primary-300 text-accent focus:ring-accent"
              />
              <span className="text-sm text-primary-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div>
        <h3 className="font-medium text-primary-900 mb-3">Prix (FCFA)</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin || ""}
            onChange={(e) =>
              setPriceMin(e.target.value ? Number(e.target.value) : undefined)
            }
            className="p-2 border border-primary-200 rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax || ""}
            onChange={(e) =>
              setPriceMax(e.target.value ? Number(e.target.value) : undefined)
            }
            className="p-2 border border-primary-200 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Surface */}
      <div>
        <h3 className="font-medium text-primary-900 mb-3">Surface (m²)</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={surfaceMin || ""}
            onChange={(e) =>
              setSurfaceMin(e.target.value ? Number(e.target.value) : undefined)
            }
            className="p-2 border border-primary-200 rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={surfaceMax || ""}
            onChange={(e) =>
              setSurfaceMax(e.target.value ? Number(e.target.value) : undefined)
            }
            className="p-2 border border-primary-200 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Chambres */}
      <div>
        <h3 className="font-medium text-primary-900 mb-3">Chambres</h3>
        <select
          value={bedrooms || ""}
          onChange={(e) =>
            setBedrooms(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-full p-2 border border-primary-200 rounded-lg text-sm"
        >
          <option value="">Tout</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Équipements standards */}
      <div>
        <h3 className="font-medium text-primary-900 mb-3">Équipements</h3>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map((amenity) => (
            <label
              key={amenity.key}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity.key)}
                onChange={() => {
                  setSelectedAmenities((prev) =>
                    prev.includes(amenity.key)
                      ? prev.filter((a) => a !== amenity.key)
                      : [...prev, amenity.key],
                  );
                }}
                className="rounded border-primary-300 text-accent focus:ring-accent"
              />
              <span className="text-sm text-primary-700">{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Caractéristiques additionnelles Afrique */}
      <div>
        <h3 className="font-medium text-primary-900 mb-3">
          Spécificités locales
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {EXTRA_FEATURES.map((feature) => (
            <label
              key={feature.key}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedExtras.includes(feature.key)}
                onChange={() => {
                  setSelectedExtras((prev) =>
                    prev.includes(feature.key)
                      ? prev.filter((f) => f !== feature.key)
                      : [...prev, feature.key],
                  );
                }}
                className="rounded border-primary-300 text-accent focus:ring-accent"
              />
              <span className="text-sm text-primary-700">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-4 border-t border-primary-100">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={handleApplyFilters}
        >
          Appliquer
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleReset}
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};
