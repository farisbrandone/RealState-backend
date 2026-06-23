"use client";

import dynamic from "next/dynamic";
import { MapPinIcon } from "@heroicons/react/24/outline";

const MapContainer = dynamic(
  () => import("react-map-gl/maplibre").then((mod) => mod.Map),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 bg-primary-100 rounded-lg animate-pulse" />
    ),
  },
);

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  title,
}) => {
  return (
    <div className="h-48 rounded-lg overflow-hidden relative">
      <MapContainer
        initialViewState={{
          latitude,
          longitude,
          zoom: 14,
        }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
        mapLib={import("maplibre-gl")}
        style={{ width: "100%", height: "100%" }}
        scrollZoom={false}
        dragPan={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        attributionControl={false}
      >
        <Marker longitude={longitude} latitude={latitude}>
          <div className="bg-accent text-white p-1 rounded-full shadow-lg">
            <MapPinIcon className="h-5 w-5" />
          </div>
        </Marker>
      </MapContainer>
      <a
        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-white text-xs px-2 py-1 rounded-lg shadow text-primary-600 hover:text-accent"
      >
        Ouvrir dans Google Maps
      </a>
    </div>
  );
};

// Import pour le Marker
import { Marker } from "react-map-gl/maplibre";
