import { SearchFilters } from "../types";
import { PROPERTY_TYPES, AMENITIES, EXTRA_FEATURES } from "@/shared/constants/property.constants";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";

export interface FilterPill {
  key: string;
  label: string;
  remove: (filters: SearchFilters) => SearchFilters;
}

const BOOLEAN_FEATURE_LABELS = [...AMENITIES, ...EXTRA_FEATURES];

/**
 * Dérive une liste de pastilles retirables individuellement à partir de
 * l'état des filtres — chaque pastille sait comment se supprimer sans
 * affecter les autres filtres actifs.
 */
export function getActiveFilterPills(filters: SearchFilters): FilterPill[] {
  const pills: FilterPill[] = [];

  (filters.propertyType ?? []).forEach((type) => {
    const label = PROPERTY_TYPES.find((t) => t.value === type)?.label ?? type;
    pills.push({
      key: `propertyType:${type}`,
      label,
      remove: (f) => ({
        ...f,
        propertyType: f.propertyType?.filter((t) => t !== type),
      }),
    });
  });

  if (filters.priceRange?.min || filters.priceRange?.max) {
    const currency = filters.priceRange.currency ?? "XAF";
    const min = filters.priceRange.min;
    const max = filters.priceRange.max;
    const label =
      min && max
        ? `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`
        : min
          ? `À partir de ${formatPrice(min, currency)}`
          : `Jusqu'à ${formatPrice(max!, currency)}`;
    pills.push({
      key: "priceRange",
      label,
      remove: (f) => ({ ...f, priceRange: undefined }),
    });
  }

  if (filters.location?.city) {
    pills.push({
      key: "location.city",
      label: filters.location.city,
      remove: (f) => ({ ...f, location: { ...f.location, city: undefined } }),
    });
  }

  if (filters.features?.bedrooms) {
    pills.push({
      key: "features.bedrooms",
      label: `${filters.features.bedrooms}+ chambres`,
      remove: (f) => ({ ...f, features: { ...f.features, bedrooms: undefined } }),
    });
  }

  if (filters.features?.squareMetersMin || filters.features?.squareMetersMax) {
    const min = filters.features.squareMetersMin;
    const max = filters.features.squareMetersMax;
    const label =
      min && max ? `${min} – ${max} m²` : min ? `À partir de ${min} m²` : `Jusqu'à ${max} m²`;
    pills.push({
      key: "features.surface",
      label,
      remove: (f) => ({
        ...f,
        features: { ...f.features, squareMetersMin: undefined, squareMetersMax: undefined },
      }),
    });
  }

  BOOLEAN_FEATURE_LABELS.forEach(({ key, label }) => {
    const features = filters.features as Record<string, unknown> | undefined;
    if (features?.[key]) {
      pills.push({
        key: `features.${key}`,
        label,
        remove: (f) => ({ ...f, features: { ...f.features, [key]: undefined } }),
      });
    }
  });

  return pills;
}
