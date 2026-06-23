'use client';

import { useCallback, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl'; // ou maplibre-gl
import { useMapStore } from '../stores/map.store';

export const useMap = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const setViewport = useMapStore(s => s.setViewport);
  const setBounds = useMapStore(s => s.setBounds);

  const onMapLoad = useCallback((map: mapboxgl.Map) => {
    mapRef.current = map;
    const center = map.getCenter();
    setViewport({ latitude: center.lat, longitude: center.lng, zoom: map.getZoom() });

    map.on('move', () => {
      const c = map.getCenter();
      setViewport({ latitude: c.lat, longitude: c.lng, zoom: map.getZoom() });
    });

    map.on('moveend', () => {
      const bounds = map.getBounds();
      if (bounds)
        setBounds([
          [bounds.getWest(), bounds.getSouth()],
          [bounds.getEast(), bounds.getNorth()],
        ]);
    });
  }, []);

  return { mapRef, onMapLoad };
};
