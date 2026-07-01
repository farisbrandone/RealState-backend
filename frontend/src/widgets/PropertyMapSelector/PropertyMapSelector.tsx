"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const MapContainer = dynamic(
  () => import("react-map-gl/maplibre").then((mod) => mod.Map),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-map-gl/maplibre").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(
  () => import("react-map-gl/maplibre").then((mod) => mod.Popup),
  { ssr: false },
);

interface PropertyMapSelectorProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

export const PropertyMapSelector: React.FC<PropertyMapSelectorProps> = ({
  onLocationSelect,
  initialLatitude = 3.848,
  initialLongitude = 11.5021, // Douala par défaut
}) => {
  const [viewState, setViewState] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
    zoom: 14,
  });
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [popupInfo, setPopupInfo] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<any>(null);

  const handleMapClick = useCallback((event: any) => {
    const { lng, lat } = event.lngLat;
    setMarker({ lat, lng });
    setPopupInfo(null);
    // Géocodage inversé
    fetch(
      `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const address =
          data.features?.[0]?.place_name ||
          `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setPopupInfo({ lat, lng, address });
      });
  }, []);

  const handleLongPress = useCallback(
    (event: any) => {
      // Simuler un appui long (300ms)
      handleMapClick(event);
    },
    [handleMapClick],
  );

  const handlePopupValidate = () => {
    if (popupInfo) {
      onLocationSelect({
        latitude: popupInfo.lat,
        longitude: popupInfo.lng,
        address: popupInfo.address,
      });
      setPopupInfo(null);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    const res = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
    );
    const data = await res.json();
    if (data.features?.length > 0) {
      const [lng, lat] = data.features[0].center;
      setViewState({ ...viewState, latitude: lat, longitude: lng, zoom: 16 });
      setMarker({ lat, lng });
      setPopupInfo({
        lat,
        lng,
        address: data.features[0].place_name,
      });
    }
  };

  const handleGeolocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewState({ ...viewState, latitude, longitude, zoom: 18 });
        setMarker({ lat: latitude, lng: longitude });
        fetch(
          `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
        )
          .then((res) => res.json())
          .then((data) => {
            const address = data.features?.[0]?.place_name || "";
            setPopupInfo({ lat: latitude, lng: longitude, address });
          });
      });
    }
  };

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    // Gestion de l'appui long
    let timer: NodeJS.Timeout;
    map.on("mousedown", (e: any) => {
      timer = setTimeout(() => handleLongPress(e), 600);
    });
    map.on("mouseup", () => clearTimeout(timer));
    map.on("touchstart", (e: any) => {
      timer = setTimeout(() => handleLongPress(e), 600);
    });
    map.on("touchend", () => clearTimeout(timer));
    return () => {
      map.off("mousedown", () => {});
      map.off("mouseup", () => {});
      map.off("touchstart", () => {});
      map.off("touchend", () => {});
    };
  }, [handleLongPress]);

  return (
    <div className="space-y-4">
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-4">
        <p className="text-sm text-primary-600 flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-accent" />
          <strong>Obligatoire :</strong> Identifiez le lieu exact sur la carte
          (appui long ou clic) puis validez l'adresse dans le popup.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un lieu..."
          className="flex-1 rounded-lg border border-primary-200 p-2.5 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="p-2.5 bg-accent text-white rounded-lg hover:bg-accent-dark"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
        <button
          onClick={handleGeolocate}
          className="p-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          title="Me localiser"
        >
          <GlobeAltIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Carte */}
      <div className="h-[400px] rounded-xl overflow-hidden border border-primary-200">
        <MapContainer
          ref={mapRef}
          {...viewState}
          onMove={(evt: any) => setViewState(evt.viewState)}
          onClick={handleMapClick}
          mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
          mapLib={import("maplibre-gl")}
          style={{ width: "100%", height: "100%" }}
          attributionControl={false}
        >
          {marker && (
            <Marker longitude={marker.lng} latitude={marker.lat}>
              <MapPinIcon className="h-8 w-8 text-accent" />
            </Marker>
          )}
          {popupInfo && (
            <Popup
              longitude={popupInfo.lng}
              latitude={popupInfo.lat}
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="text-sm p-2 max-w-xs">
                <p className="font-medium mb-2">{popupInfo.address}</p>
                <button
                  onClick={handlePopupValidate}
                  className="w-full bg-accent text-white px-3 py-1.5 rounded text-sm hover:bg-accent-dark"
                >
                  Valider cette position
                </button>
              </div>
            </Popup>
          )}
        </MapContainer>
      </div>
    </div>
  );
};
