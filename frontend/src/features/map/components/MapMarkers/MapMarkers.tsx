"use client";

import { Marker, Popup } from "react-map-gl/maplibre";
import { PropertyMapItem } from "../../types";
import { useMapStore } from "../../stores/map.store";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import { formatLocation } from "@/shared/lib/formatters/location.formatter";
import { getMediaUrl } from "@/shared/lib/media/media-url";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HomeIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  KeyIcon,
  GlobeAltIcon,
  TruckIcon,
  BriefcaseIcon,
  MapPinIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";

import "maplibre-gl/dist/maplibre-gl.css";

// Mapping type de bien → icône (jeu d'icônes plus cohérent et complet)
const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  apartment: BuildingOfficeIcon,
  apartment_furnished: BuildingOfficeIcon,
  apartment_unfurnished: BuildingOfficeIcon,
  studio: BuildingOfficeIcon,
  studio_simple: BuildingOfficeIcon,
  studio_modern: BuildingOfficeIcon,
  room: KeyIcon,
  room_modern: KeyIcon,
  room_furnished: KeyIcon,
  villa: HomeIcon,
  duplex: HomeIcon,
  house: HomeIcon,
  land: GlobeAltIcon,
  commercial: BuildingStorefrontIcon,
  shop: BuildingStorefrontIcon,
  warehouse: TruckIcon,
  coworking: BriefcaseIcon,
  hotel_room: KeyIcon,
  office: BriefcaseIcon,
  building: BuildingOfficeIcon,
  parking: TruckIcon,
};

function getPropertyIcon(type: string) {
  return typeIcons[type] || MapPinIcon;
}

// Formatte un prix compact pour tenir dans le pin (ex: 1.2M, 850k)
function formatCompactPrice(price: number, currency = "FCFA") {
  if (price >= 1_000_000)
    return `${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}M`;
  if (price >= 1_000) return `${Math.round(price / 1_000)}k`;
  return `${price}`;
}

interface MapMarkersProps {
  properties: PropertyMapItem[];
}

export const MapMarkers: React.FC<MapMarkersProps> = ({ properties }) => {
  const selectedId = useMapStore((s) => s.selectedPropertyId);
  const setSelectedId = useMapStore((s) => s.setSelectedPropertyId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedProperty = properties.find((p) => p.id === selectedId);

  // Regroupement simple par position arrondie pour éviter la superposition
  // parfaite de deux biens à la même adresse (cluster visuel léger).
  const positioned = useMemo(() => {
    const seen = new Map<string, number>();
    return properties.map((p) => {
      const key = `${p.location.geoPoint.lat.toFixed(3)}_${p.location.geoPoint.lon.toFixed(3)}`;
      const count = seen.get(key) ?? 0;
      seen.set(key, count + 1);
      // léger décalage circulaire si plusieurs biens partagent la même position
      const offset = count * 0.0006;
      return {
        ...p,
        _lat: p.location.geoPoint.lat + offset,
        _lon: p.location.geoPoint.lon + offset,
      };
    });
  }, [properties]);

  return (
    <>
      {positioned.map((property) => {
        const Icon = getPropertyIcon(property.propertyType);
        const isSale = property.transactionType === "sale";
        const isSelected = property.id === selectedId;
        const isHovered = property.id === hoveredId;

        return (
          <Marker
            key={property.id}
            longitude={property._lon}
            latitude={property._lat}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedId(property.id);
            }}
          >
            <div
              onMouseEnter={() => setHoveredId(property.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer select-none"
              style={{
                transform: isSelected || isHovered ? "scale(1.12)" : "scale(1)",
                transition: "transform 180ms ease, box-shadow 180ms ease",
                zIndex: isSelected || isHovered ? 20 : 1,
              }}
            >
              {/* Pin façon "prix" — bulle arrondie + pointe en bas */}
              <div
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-lg ring-2 transition-colors ${
                  isSale ? "bg-ink ring-white" : "bg-accent ring-white"
                } ${isSelected ? "ring-4 ring-accent/40" : ""}`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    isSale ? "bg-white/15" : "bg-ink/10"
                  }`}
                >
                  <Icon className={`h-3 w-3 ${isSale ? "text-white" : "text-ink"}`} />
                </span>
                <span
                  className={`text-[11px] font-bold whitespace-nowrap ${isSale ? "text-white" : "text-ink"}`}
                >
                  {formatCompactPrice(property.price)}
                </span>
              </div>
              {/* Pointe du pin */}
              <div
                className={`mx-auto h-0 w-0 border-x-4 border-x-transparent border-t-[6px] ${
                  isSale ? "border-t-ink" : "border-t-accent"
                }`}
                style={{ marginTop: -1 }}
              />
            </div>
          </Marker>
        );
      })}

      {selectedProperty && (
        <Popup
          longitude={selectedProperty.location.geoPoint.lon}
          latitude={selectedProperty.location.geoPoint.lat}
          onClose={() => setSelectedId(null)}
          closeButton={true}
          closeOnClick={false}
          anchor="bottom"
          offset={28}
          className="property-popup"
        >
          <div className="w-[240px] overflow-hidden rounded-xl">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary-100">
              {getMediaUrl(selectedProperty.images?.[0]) ? (
                <img
                  src={getMediaUrl(selectedProperty.images?.[0])!}
                  alt={selectedProperty.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-primary-400">
                    Photo indisponible
                  </span>
                </div>
              )}
              <span
                className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  selectedProperty.transactionType === "sale"
                    ? "bg-ink text-white"
                    : "bg-accent text-ink"
                }`}
              >
                {selectedProperty.transactionType === "sale"
                  ? "À vendre"
                  : "À louer"}
              </span>
            </div>

            <div className="p-3">
              <p className="text-base font-bold text-accent">
                {formatPrice(selectedProperty.price)}{" "}
                {selectedProperty.currency}
                {selectedProperty.transactionType === "rent" && (
                  <span className="text-xs font-normal text-primary-400">
                    {" "}
                    /mois
                  </span>
                )}
              </p>
              <Link
                href={`/properties/${selectedProperty.id}`}
                onClick={() => setSelectedId(null)}
              >
                <h3 className="mt-0.5 line-clamp-2 font-heading text-sm text-primary-900 hover:text-accent transition-colors">
                  {selectedProperty.title}
                </h3>
              </Link>
              <p className="mt-1 flex items-center gap-1 text-xs text-primary-500">
                <MapPinIcon className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {formatLocation({
                    neighborhood: selectedProperty.location.neighborhood,
                    city: selectedProperty.location.city,
                    country: selectedProperty.location.country,
                  })}
                </span>
              </p>

              <Link
                href={`/properties/${selectedProperty.id}`}
                className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-accent-dark"
                onClick={() => setSelectedId(null)}
              >
                <ArrowsPointingOutIcon className="h-3 w-3" />
                Voir les détails
              </Link>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
};
