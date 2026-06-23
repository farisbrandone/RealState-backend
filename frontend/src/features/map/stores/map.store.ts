import { create } from 'zustand';

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface MapState {
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
  bounds: [[number, number], [number, number]] | null;
  setBounds: (bounds: [[number, number], [number, number]]) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useMapStore = create<MapState>(set => ({
  viewport: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 11,
  },
  setViewport: viewport => set({ viewport }),
  bounds: null,
  setBounds: bounds => set({ bounds }),
  selectedPropertyId: null,
  setSelectedPropertyId: id => set({ selectedPropertyId: id }),
  searchQuery: '',
  setSearchQuery: q => set({ searchQuery: q }),
}));
