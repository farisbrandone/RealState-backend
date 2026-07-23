import React from "react";
import Link from "next/link";
import { PropertySearchResult } from "@/features/property-search/types";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import { getMediaUrl } from "@/shared/lib/media/media-url";
import { useFavoritesStore } from "@/features/favorites/stores/favorites.store";
import { PROPERTY_TYPES } from "@/shared/constants/property.constants";
import { FavoriteButton } from "@/shared/ui/components/FavoriteButton/FavoriteButton";
import { formatLocation } from "@/shared/lib/formatters/location.formatter";
import {
  MapPinIcon,
  ArrowsPointingOutIcon,
  HomeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface PropertyListItemProps {
  property: PropertySearchResult;
}

export const PropertyListItem: React.FC<PropertyListItemProps> = ({
  property,
}) => {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(property.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const typeLabel =
    PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label ||
    property.propertyType;

  return (
    <div className="group bg-surface rounded-xl shadow-card hover:shadow-soft transition-all flex flex-col md:flex-row overflow-hidden">
      {/* Image */}
      <Link
        href={`/properties/${property.id}`}
        className="relative md:w-80 aspect-[4/3] md:aspect-auto overflow-hidden shrink-0"
      >
        <img
          src={
            getMediaUrl(property.images?.[0]) ||
            "/images/property-placeholder.jpg"
          }
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-accent text-ink text-xs font-bold px-2 py-1 rounded-full">
          {property.transactionType === "sale" ? "À vendre" : "À louer"}
        </span>
      </Link>

      {/* Détails */}
      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-2xl font-bold text-accent">
                {formatPrice(property.price, property.currency)}
              </span>
              {property.transactionType === "rent" && (
                <span className="text-sm text-primary-400"> / mois</span>
              )}
            </div>
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={() => toggleFavorite(property)}
              iconClassName="h-6 w-6"
              className="p-2 hover:bg-primary-50 rounded-full transition-colors"
            />
          </div>

          <Link href={`/properties/${property.id}`}>
            <h3 className="font-heading text-xl text-primary-900 group-hover:text-accent transition-colors mb-2">
              {property.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2 text-sm text-primary-500 mb-2">
            <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
              {typeLabel}
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              {formatLocation({
                neighborhood: property.location?.neighborhood,
                city: property.location?.city,
                country: property.location?.country,
              })}
            </span>
          </div>

          <p className="text-primary-600 line-clamp-2 mb-4">
            {property.description}
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-primary-600 border-t border-primary-100 pt-4">
          {property.features?.bedrooms && (
            <span className="flex items-center gap-1">
              <HomeIcon className="h-4 w-4" />
              <span className="font-medium">
                {property.features.bedrooms}
              </span>{" "}
              chambres
            </span>
          )}
          {property.features?.squareMeters && (
            <span className="flex items-center gap-1">
              <ArrowsPointingOutIcon className="h-4 w-4" />
              <span className="font-medium">
                {property.features.squareMeters}
              </span>{" "}
              m²
            </span>
          )}
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {new Date(property.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>
    </div>
  );
};
