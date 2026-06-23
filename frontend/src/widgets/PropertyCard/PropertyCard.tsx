import React, { useState } from "react";
import Link from "next/link";
import { PropertySearchResult } from "@/features/property-search/types";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import { PROPERTY_TYPES } from "@/shared/constants/property.constants";
import {
  HeartIcon,
  MapPinIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface PropertyCardProps {
  property: PropertySearchResult;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  compact = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const typeLabel =
    PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label ||
    property.propertyType;

  return (
    <div
      className={`group bg-surface rounded-xl shadow-card overflow-hidden hover:shadow-soft transition-all duration-300 transform hover:-translate-y-1 ${compact ? "text-sm" : ""}`}
    >
      {/* Image */}
      <Link
        href={`/properties/${property.id}`}
        className={`block relative ${compact ? "aspect-[4/3]" : "aspect-[4/3]"} overflow-hidden`}
      >
        <img
          src={property.images?.[0] || "/images/property-placeholder.jpg"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
          {property.transactionType === "sale" ? "À vendre" : "À louer"}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
        >
          {isFavorite ? (
            <HeartSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-primary-600" />
          )}
        </button>
      </Link>

      {/* Contenu */}
      <div className="p-4">
        <div className="mb-2">
          <span
            className={`font-bold text-accent ${compact ? "text-lg" : "text-xl"}`}
          >
            {formatPrice(property.price, property.currency)}
          </span>
          {property.transactionType === "rent" && (
            <span className="text-sm text-primary-400"> / mois</span>
          )}
        </div>

        <Link href={`/properties/${property.id}`}>
          <h3
            className={`font-heading text-primary-900 line-clamp-2 group-hover:text-accent transition-colors mb-2 ${compact ? "text-base" : "text-lg"}`}
          >
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-primary-500 mb-2">
          <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-xs">
            {typeLabel}
          </span>
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4 text-primary-400" />
            {property.location?.city || "Localisation inconnue"},{" "}
            {property.location?.country || ""}
          </span>
        </div>

        {!compact && property.description && (
          <p className="text-primary-600 text-sm line-clamp-2 mb-3">
            {property.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-primary-600 border-t border-primary-100 pt-3">
          {property.features?.bedrooms && (
            <span className="flex items-center gap-1">
              <span className="font-medium">{property.features.bedrooms}</span>{" "}
              ch.
            </span>
          )}
          {property.features?.bathrooms && (
            <span className="flex items-center gap-1">
              <span className="font-medium">{property.features.bathrooms}</span>{" "}
              sdb
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
        </div>
      </div>
    </div>
  );
};
