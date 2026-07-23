"use client";

import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { AFRICA_FRANCOPHONE_LOCATIONS } from "@/shared/data/locations.data";
import {
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { PropertyFormValues } from "../types";

interface LocationCascadeFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  // Appelé quand pays/ville changent, pour recentrer la carte sur un point de départ cohérent
  onCityCenterChange: (center: { lat: number; lon: number } | null) => void;
}

export const LocationCascadeFields: React.FC<LocationCascadeFieldsProps> = ({
  form,
  onCityCenterChange,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // Cast local — évite l'erreur TS liée au typage générique `UseFormReturn<any>`
  const addressErrors = errors.address as
    | { country?: { message?: string }; city?: { message?: string } }
    | undefined;

  const selectedCountryName = watch("address.country");
  const selectedCityName = watch("address.city");

  const selectedCountry = useMemo(
    () =>
      AFRICA_FRANCOPHONE_LOCATIONS.find((c) => c.name === selectedCountryName),
    [selectedCountryName],
  );

  const selectedCity = useMemo(
    () => selectedCountry?.cities.find((c) => c.name === selectedCityName),
    [selectedCountry, selectedCityName],
  );

  // Recentre la carte dès qu'une ville est choisie — point de départ, l'agent affine ensuite
  useEffect(() => {
    if (selectedCity) {
      onCityCenterChange({ lat: selectedCity.lat, lon: selectedCity.lon });
    } else {
      onCityCenterChange(null);
    }
    // Réinitialise le quartier si la ville change et que le quartier actuel n'appartient plus à cette ville
    const currentNeighborhood = watch("address.neighborhood");
    if (
      currentNeighborhood &&
      !selectedCity?.neighborhoods.includes(currentNeighborhood)
    ) {
      setValue("address.neighborhood", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCityName]);

  // Réinitialise ville/quartier si le pays change
  const handleCountryChange = (countryName: string) => {
    setValue("address.country", countryName);
    setValue("address.city", "");
    setValue("address.neighborhood", "");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Pays */}
      <div>
        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-primary-700">
          <GlobeAltIcon className="h-4 w-4 text-primary-400" />
          Pays
        </label>
        <select
          value={selectedCountryName || ""}
          onChange={(e) => handleCountryChange(e.target.value)}
          className={`w-full rounded-lg border p-3 bg-surface focus:ring-2 focus:ring-accent focus:outline-none ${
            addressErrors?.country ? "border-red-300" : "border-primary-200"
          }`}
        >
          <option value="">Sélectionner un pays</option>
          {AFRICA_FRANCOPHONE_LOCATIONS.map((c) => (
            <option key={c.code} value={c.name}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
        {addressErrors?.country && (
          <p className="mt-1 text-xs text-red-500">Le pays est requis</p>
        )}
      </div>

      {/* Ville */}
      <div>
        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-primary-700">
          <BuildingOfficeIcon className="h-4 w-4 text-primary-400" />
          Ville
        </label>
        <select
          {...register("address.city", { required: true })}
          disabled={!selectedCountry}
          className={`w-full rounded-lg border p-3 bg-surface focus:ring-2 focus:ring-accent focus:outline-none disabled:cursor-not-allowed disabled:bg-primary-50 disabled:text-primary-300 ${
            addressErrors?.city ? "border-red-300" : "border-primary-200"
          }`}
        >
          <option value="">
            {selectedCountry
              ? "Sélectionner une ville"
              : "Choisissez d'abord un pays"}
          </option>
          {selectedCountry?.cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name} {city.isCapital ? "★" : ""}
            </option>
          ))}
        </select>
        {addressErrors?.city && (
          <p className="mt-1 text-xs text-red-500">La ville est requise</p>
        )}
      </div>

      {/* Quartier */}
      <div>
        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-primary-700">
          <MapPinIcon className="h-4 w-4 text-primary-400" />
          Quartier
        </label>
        <select
          {...register("address.neighborhood")}
          disabled={!selectedCity}
          className="w-full rounded-lg border border-primary-200 bg-surface p-3 focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:bg-primary-50 disabled:text-primary-300"
        >
          <option value="">
            {selectedCity
              ? "Sélectionner un quartier (optionnel)"
              : "Choisissez d'abord une ville"}
          </option>
          {selectedCity?.neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-primary-400">
          Introuvable ? Précisez-le dans "Rue / point de repère" ci-dessous.
        </p>
      </div>
    </div>
  );
};
