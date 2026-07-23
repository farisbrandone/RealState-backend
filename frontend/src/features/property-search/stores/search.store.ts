import { create } from "zustand";
import { SearchFilters, PropertySearchResult, SearchResponse } from "../types";

interface SearchState {
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  results: SearchResponse | null;
  setResults: (results: SearchResponse) => void;
  page: number;
  setPage: (page: number) => void;
  viewMode: "list" | "map";
  setViewMode: (mode: "list" | "map") => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  filters: {
    transactionType: "sale",
  },
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  results: null,
  setResults: (results) => set({ results }),
  page: 1,
  setPage: (page) => set({ page }),
  viewMode: "list",
  setViewMode: (mode) => set({ viewMode: mode }),
}));
