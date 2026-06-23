import { useEffect } from 'react';
import { useMapStore } from '../stores/map.store';
import type { Map } from 'mapbox-gl';

// Ce hook gère l'ajout et la mise à jour des marqueurs sur la carte
export const useMapMarkers = (map: Map | null, markers: any[]) => {
  // Implémentation simplifiée : nous utiliserons le composant react-map-gl Marker
};
