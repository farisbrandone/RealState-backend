"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { AFRICA_FRANCOPHONE_LOCATIONS } from "@/shared/data/locations.data";

const MapGL = dynamic(
  () => import("react-map-gl/maplibre").then((mod) => mod.Map),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-map-gl/maplibre").then((mod) => mod.Marker),
  { ssr: false },
);

// Codes ISO des pays couverts — utilisés pour biaiser la recherche MapTiler
const COVERED_COUNTRY_CODES = AFRICA_FRANCOPHONE_LOCATIONS.map((c) =>
  c.code.toLowerCase(),
).join(",");

interface PropertyMapSelectorProps {
  onLocationSelect: (
    location: {
      latitude: number;
      longitude: number;
      address: string;
    } | null,
  ) => void;
  // Reçu du formulaire quand pays/ville sont choisis — recentre la carte automatiquement
  cityCenter?: { lat: number; lon: number } | null;
  initialLatitude?: number;
  initialLongitude?: number;
  // Position déjà connue (mode édition) : place le repère dès le montage au
  // lieu de laisser la carte vide — sans ça, modifier une annonce existante
  // ne montrait jamais sa position actuelle.
  initialMarker?: { lat: number; lng: number } | null;
  initialAddress?: string | null;
  hasError?: boolean;
}

export const PropertyMapSelector: React.FC<PropertyMapSelectorProps> = ({
  onLocationSelect,
  cityCenter,
  initialLatitude = 3.848,
  initialLongitude = 11.5021,
  initialMarker = null,
  initialAddress = null,
  hasError = false,
}) => {
  const [viewState, setViewState] = useState({
    latitude: initialMarker?.lat ?? initialLatitude,
    longitude: initialMarker?.lng ?? initialLongitude,
    zoom: initialMarker ? 15 : 12,
  });
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialMarker,
  );
  const [confirmedAddress, setConfirmedAddress] = useState<string | null>(
    initialAddress,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  // Sans ce useMemo, `mapLib={import("maplibre-gl")}` recréait une nouvelle
  // Promise à chaque rendu (même si le module est déjà en cache Webpack) —
  // react-map-gl pouvait alors réinitialiser la carte en plein milieu du
  // géocodage inverse déclenché par un clic, et le marqueur tout juste posé
  // disparaissait (repère "perdu" par intermittence après un clic).
  const mapLib = useMemo(() => import("maplibre-gl"), []);

  // Recentre la carte sur la ville choisie dans le formulaire (point de départ),
  // sans placer de marqueur — l'agent doit toujours confirmer la position exacte.
  useEffect(() => {
    if (cityCenter) {
      setViewState((prev) => ({
        ...prev,
        latitude: cityCenter.lat,
        longitude: cityCenter.lon,
        zoom: 13,
      }));
    }
  }, [cityCenter]);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
      );
      if (!res.ok) throw new Error("Échec du géocodage inverse");
      const data = await res.json();
      return (
        data.features?.[0]?.place_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      );
    } catch {
      setGeoError(
        "Impossible de récupérer l'adresse pour ce point, mais les coordonnées sont bien enregistrées.",
      );
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  }, []);

  const placeMarker = useCallback(
    async (lat: number, lng: number) => {
      setGeoError(null);
      setMarker({ lat, lng });
      setConfirmedAddress(null);
      onLocationSelect(null); // invalide la sélection tant que le géocodage n'a pas confirmé
      const address = await reverseGeocode(lat, lng);
      setConfirmedAddress(address);
      onLocationSelect({ latitude: lat, longitude: lng, address });
      toast.success(`Position enregistrée : ${address}`, { duration: 4000 });
    },
    [onLocationSelect, reverseGeocode],
  );

  const handleMapClick = useCallback(
    (event: any) => {
      const { lng, lat } = event.lngLat;
      placeMarker(lat, lng);
    },
    [placeMarker],
  );

  // Le marqueur est déplaçable : précision au pixel près après un premier placement
  const handleMarkerDragEnd = useCallback(
    (event: any) => {
      const { lng, lat } = event.lngLat;
      placeMarker(lat, lng);
    },
    [placeMarker],
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setGeoError(null);
    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          searchQuery,
        )}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}&country=${COVERED_COUNTRY_CODES}`,
      );
      if (!res.ok) throw new Error("Échec de la recherche");
      const data = await res.json();
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center;
        setViewState((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          zoom: 16,
        }));
        await placeMarker(lat, lng);
      } else {
        setGeoError(
          "Aucun résultat trouvé dans les pays couverts par la plateforme.",
        );
      }
    } catch {
      setGeoError(
        "La recherche a échoué. Essayez de cliquer directement sur la carte.",
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleGeolocate = () => {
    if (!("geolocation" in navigator)) {
      setGeoError("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setViewState((prev) => ({ ...prev, latitude, longitude, zoom: 17 }));
        await placeMarker(latitude, longitude);
        setIsLocating(false);
      },
      () => {
        setGeoError("Localisation refusée ou indisponible.");
        setIsLocating(false);
      },
    );
  };

  return (
    <div className="space-y-3">
      <div
        className={`flex items-start gap-2 rounded-xl border p-4 ${
          hasError && !marker
            ? "border-red-200 bg-red-50"
            : "border-accent/20 bg-accent/5"
        }`}
      >
        {hasError && !marker ? (
          <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-red-500" />
        ) : (
          <MapPinIcon className="h-5 w-5 shrink-0 text-accent" />
        )}
        <p
          className={`text-sm ${hasError && !marker ? "text-red-600" : "text-primary-600"}`}
        >
          <strong>Obligatoire :</strong> cliquez sur la carte pour placer le
          repère à l'emplacement exact du bien, puis affinez sa position en le
          faisant glisser si besoin.
        </p>
      </div>

      {/* Barre de recherche et géolocalisation */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une adresse, un lieu-dit..."
            className="w-full rounded-lg border border-primary-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleSearch())
            }
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="flex items-center justify-center rounded-lg bg-accent p-2.5 text-ink transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={isLocating}
          className="flex items-center justify-center rounded-lg bg-primary-500 p-2.5 text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
          title="Me localiser"
        >
          <GlobeAltIcon
            className={`h-5 w-5 ${isLocating ? "animate-pulse" : ""}`}
          />
        </button>
      </div>

      {geoError && (
        <p className="flex items-center gap-1.5 text-xs text-amber-600">
          <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
          {geoError}
        </p>
      )}

      {/* Carte */}
      <div className="relative h-[380px] overflow-hidden rounded-xl border border-primary-200">
        <MapGL
          ref={mapRef}
          {...viewState}
          onMove={(evt: any) => setViewState(evt.viewState)}
          onClick={handleMapClick}
          mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
          mapLib={mapLib}
          style={{ width: "100%", height: "100%" }}
          attributionControl={false}
          cursor="crosshair"
        >
          {marker && (
            <Marker
              longitude={marker.lng}
              latitude={marker.lat}
              draggable
              onDragEnd={handleMarkerDragEnd}
            >
              <div className="group cursor-grab active:cursor-grabbing">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent shadow-lg ring-4 ring-white transition-transform group-hover:scale-110">
                  <MapPinIcon className="h-5 w-5 text-ink" />
                </div>
              </div>
            </Marker>
          )}
        </MapGL>

        {/* Overlay d'aide quand aucun marqueur n'existe encore */}
        {!marker && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/5">
            <div className="rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-primary-600 shadow-card">
              Cliquez sur la carte pour placer le repère
            </div>
          </div>
        )}
      </div>

      {/* Barre de confirmation de l'adresse — toujours visible sous la carte, pas seulement dans un popup */}
      {marker && (
        <div className="flex items-start gap-2 rounded-lg bg-primary-50 p-3">
          {confirmedAddress ? (
            <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-500" />
          ) : (
            <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-primary-300 border-t-accent" />
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium text-primary-400">
              Position confirmée
            </p>
            <p className="truncate text-sm text-primary-800">
              {confirmedAddress ?? "Récupération de l'adresse..."}
            </p>
            <p className="mt-0.5 font-mono text-xs text-primary-400">
              {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
