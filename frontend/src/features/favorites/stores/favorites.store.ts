import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PropertySearchResult } from "@/features/property-search/types";

interface FavoritesState {
  favorites: PropertySearchResult[];
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (property: PropertySearchResult) => void;
  removeFavorite: (propertyId: string) => void;
}

// Seule source de vérité pour les favoris (localStorage via zustand/persist) :
// PropertyCard/PropertyListItem et la page /favorites lisent et écrivent ici,
// alors qu'auparavant seule la page lisait une clé que rien n'écrivait jamais.
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isFavorite: (propertyId) =>
        get().favorites.some((f) => f.id === propertyId),
      toggleFavorite: (property) =>
        set((state) => {
          const exists = state.favorites.some((f) => f.id === property.id);
          return {
            favorites: exists
              ? state.favorites.filter((f) => f.id !== property.id)
              : [...state.favorites, property],
          };
        }),
      removeFavorite: (propertyId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== propertyId),
        })),
    }),
    { name: "luxhorizon_favorites" },
  ),
);
