'use client';

import { useRef, useCallback } from 'react';
import Map, { MapRef } from 'react-map-gl/maplibre';
import { MAPTILER_CONFIG } from '@/shared/config/maptiler.config';
import { useMapStore } from '../../stores/map.store';

interface MapContainerProps {
  children?: React.ReactNode;
  className?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({ children, className = '' }) => {
  const mapRef = useRef<MapRef>(null);
  const viewport = useMapStore(s => s.viewport);
  const setViewport = useMapStore(s => s.setViewport);

  const onMove = useCallback((evt: any) => {
    setViewport({
      latitude: evt.viewState.latitude,
      longitude: evt.viewState.longitude,
      zoom: evt.viewState.zoom,
    });
  }, []);

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Map
        ref={mapRef}
        {...viewport}
        onMove={onMove}
        mapStyle={MAPTILER_CONFIG.mapStyle + `?key=${MAPTILER_CONFIG.apiKey}`}
        mapLib={import('maplibre-gl')}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </Map>
    </div>
  );
};
