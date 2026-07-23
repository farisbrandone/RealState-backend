import React, { useState } from "react";
import Link from "next/link";
import { PropertySearchResult } from "@/features/property-search/types";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import { getMediaUrl } from "@/shared/lib/media/media-url";
import { useFavoritesStore } from "@/features/favorites/stores/favorites.store";
import { PROPERTY_TYPES } from "@/shared/constants/property.constants";
import { FavoriteButton } from "@/shared/ui/components/FavoriteButton/FavoriteButton";
import { formatLocation } from "@/shared/lib/formatters/location.formatter";
import { MapPinIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

interface PropertyCardProps {
  property: PropertySearchResult;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  compact = false,
}) => {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(property.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const [imgError, setImgError] = useState(false);
  const typeLabel =
    PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label ||
    property.propertyType;

  const imageSrc = !imgError ? getMediaUrl(property.images?.[0]) : null;

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft ${compact ? "text-sm" : ""}`}
    >
      {/* Image */}
      <Link
        href={`/properties/${property.id}`}
        className="relative block aspect-[4/3] shrink-0 overflow-hidden bg-primary-100"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-100">
            <span className="text-xs text-primary-400">Photo indisponible</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-1 text-xs font-bold text-ink">
          {property.transactionType === "sale" ? "À vendre" : "À louer"}
        </span>
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={() => toggleFavorite(property)}
          className="absolute right-2.5 top-2.5 rounded-full bg-white/80 p-2.5 backdrop-blur-sm transition-colors hover:bg-white"
        />
      </Link>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-baseline gap-x-1.5">
          <span
            className={`font-bold text-accent ${compact ? "text-base" : "text-lg sm:text-xl"}`}
          >
            {formatPrice(property.price, property.currency)}
          </span>
          {property.transactionType === "rent" && (
            <span className="text-sm text-primary-400">/ mois</span>
          )}
        </div>

        <Link href={`/properties/${property.id}`}>
          <h3
            className={`mb-2 line-clamp-2 font-heading text-primary-900 transition-colors group-hover:text-accent ${compact ? "text-sm" : "text-base sm:text-lg"}`}
          >
            {property.title}
          </h3>
        </Link>

        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-primary-500 sm:text-sm">
          <span className="shrink-0 rounded-full bg-primary-100 px-2 py-0.5 text-primary-600">
            {typeLabel}
          </span>
          <span className="flex min-w-0 items-center gap-1">
            <MapPinIcon className="h-4 w-4 shrink-0 text-primary-400" />
            <span className="truncate">
              {formatLocation({
                neighborhood: property.location?.neighborhood,
                city: property.location?.city,
                country: property.location?.country,
              })}
            </span>
          </span>
        </div>

        {!compact && property.description && (
          <p className="mb-3 line-clamp-2 text-sm text-primary-600">
            {property.description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-primary-100 pt-3 text-sm text-primary-600">
          {property.features?.bedrooms && (
            <span className="flex shrink-0 items-center gap-1 whitespace-nowrap">
              <span className="font-medium">{property.features.bedrooms}</span>{" "}
              ch.
            </span>
          )}
          {property.features?.bathrooms && (
            <span className="flex shrink-0 items-center gap-1 whitespace-nowrap">
              <span className="font-medium">{property.features.bathrooms}</span>{" "}
              sdb
            </span>
          )}
          {property.features?.squareMeters && (
            <span className="flex shrink-0 items-center gap-1 whitespace-nowrap">
              <ArrowsPointingOutIcon className="h-4 w-4" />
              <span className="font-medium">
                {property.features.squareMeters}
              </span>{" "}
              m²
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
