"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSearchStore } from "@/features/property-search/stores/search.store";
import { usePropertySearch } from "@/features/property-search/hooks/usePropertySearch";
import { SearchBar } from "@/widgets/SearchBar/SearchBar";
import { PropertyCard } from "@/widgets/PropertyCard/PropertyCard";
import { PropertyListItem } from "@/widgets/PropertyListItem/PropertyListItem";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import { Button } from "@/shared/ui/components/Button/Button";
import {
  MapIcon,
  ListBulletIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import { FiltersPanel } from "@/widgets/FiltersPanel/FiltersPanel";
import { ActiveFilterPills } from "@/widgets/ActiveFilterPills/ActiveFilterPills";
import { PropertyCardSkeleton } from "@/widgets/PropertyCard/PropertyCardSkeleton";
import { EmptyState } from "@/shared/ui/components/EmptyState/EmptyState";
import { getActiveFilterPills } from "@/features/property-search/lib/filter-pills";
import { useCreateSavedSearch } from "@/features/alerts/hooks/useSavedSearches";

const DynamicMapContainer = dynamic(
  () =>
    import("@/features/map/components/MapContainer/MapContainer").then(
      (mod) => mod.MapContainer,
    ),
  { ssr: false, loading: () => <Skeleton className="h-full w-full" /> },
);

const DynamicMapMarkers = dynamic(
  () =>
    import("@/features/map/components/MapMarkers/MapMarkers").then(
      (mod) => mod.MapMarkers,
    ),
  { ssr: false },
);

export default function SearchPage() {
  const { data: searchData, isLoading } = usePropertySearch();
  const results = useSearchStore((s) => s.results);
  const viewMode = useSearchStore((s) => s.viewMode);
  const setViewMode = useSearchStore((s) => s.setViewMode);
  const setPage = useSearchStore((s) => s.setPage);
  const page = useSearchStore((s) => s.page);
  const filters = useSearchStore((s) => s.filters);
  const setFilters = useSearchStore((s) => s.setFilters);
  const createSavedSearch = useCreateSavedSearch();

  const handleSaveSearch = () => {
    createSavedSearch.mutate({
      name:
        [filters.location?.city, filters.transactionType === "rent" ? "location" : "achat"]
          .filter(Boolean)
          .join(" — ") || "Ma recherche",
      transactionType: filters.transactionType,
      propertyType: filters.propertyType,
      city: filters.location?.city,
      priceMin: filters.priceRange?.min,
      priceMax: filters.priceRange?.max,
      bedroomsMin: filters.features?.bedrooms,
    });
  };

  const properties = results?.items || [];
  const total = results?.total || 0;
  const totalPages = results?.totalPages || 0;

  const [showFilters, setShowFilters] = useState(false);
  const activeFilterCount = getActiveFilterPills(filters).length;
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    useSearchStore.getState().setFilters({
      ...filters,
      sortBy: field,
      sortOrder: sortOrder === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Barre de recherche collante en haut */}
      <div className="sticky top-[73px] z-40 bg-surface border-b border-primary-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <SearchBar compact />
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px-80px)]">
        {/* Panneau de filtres (desktop) */}
        <aside className="hidden lg:block w-80 bg-surface border-r border-primary-100 overflow-y-auto">
          <FiltersPanel />
        </aside>

        {/* Zone principale */}
        <div className="flex-1 flex flex-col">
          {/* Barre d'outils — empilée verticalement sur mobile : sur une
              seule ligne, "Filtres" + tri + "Alerte" + bascule vue dépassaient
              systématiquement du viewport (voir capture utilisateur), coupant
              le sélecteur de tri et écrasant le titre sur deux lignes. Les
              contrôles ont leur propre ligne, scrollable horizontalement en
              dernier recours plutôt que rognés hors écran. */}
          <div className="flex flex-col gap-2 px-4 py-3 bg-surface border-b border-primary-100 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div>
              <h1 className="text-lg font-heading">
                {total} bien{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
              </h1>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto sm:gap-3">
              {/* Filtres mobiles */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden relative flex shrink-0 items-center gap-1 px-3 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100"
              >
                <FunnelIcon className="h-5 w-5" />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-ink">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Tri */}
              <div className="flex shrink-0 items-center gap-1">
                <ArrowsUpDownIcon className="hidden h-5 w-5 shrink-0 text-primary-400 sm:block" />
                <select
                  aria-label="Trier les résultats"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order as "asc" | "desc");
                  }}
                  className="text-sm border-0 bg-transparent focus:ring-0 text-primary-600"
                >
                  <option value="createdAt-desc">Plus récents</option>
                  <option value="createdAt-asc">Plus anciens</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="surface-asc">Surface croissante</option>
                  <option value="surface-desc">Surface décroissante</option>
                </select>
              </div>

              {/* Enregistrer cette recherche en alerte */}
              <button
                type="button"
                onClick={handleSaveSearch}
                disabled={createSavedSearch.isPending}
                title="Être notifié des nouveaux biens correspondant à cette recherche"
                className="hidden sm:flex shrink-0 items-center gap-1 px-3 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 disabled:opacity-50"
              >
                <BellAlertIcon className="h-5 w-5" />
                <span className="text-sm">Alerte</span>
              </button>

              {/* Vue carte/liste */}
              <div className="flex shrink-0 border border-primary-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title="Vue liste"
                  aria-label="Vue liste"
                  aria-pressed={viewMode === "list"}
                  className={`p-2 ${viewMode === "list" ? "bg-accent text-ink" : "bg-surface text-primary-500"}`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  title="Vue carte"
                  aria-label="Vue carte"
                  aria-pressed={viewMode === "map"}
                  className={`p-2 ${viewMode === "map" ? "bg-accent text-ink" : "bg-surface text-primary-500"}`}
                >
                  <MapIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <ActiveFilterPills />

          {/* Contenu principal : liste et/ou carte */}
          <div className="flex-1 flex overflow-hidden">
            {/* Vue liste */}
            <div
              className={`${viewMode === "map" ? "hidden lg:block lg:w-1/2" : "w-full"} overflow-y-auto`}
            >
              {isLoading ? (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <EmptyState
                  className="h-full"
                  icon={<MapIcon className="h-9 w-9" />}
                  title="Aucun bien trouvé"
                  description="Essayez d'élargir vos critères de recherche."
                  action={
                    <Button variant="outline" onClick={() => setFilters({})}>
                      Réinitialiser les filtres
                    </Button>
                  }
                />
              ) : (
                <>
                  {/* Grille ou liste */}
                  {viewMode === "list" ? (
                    <div className="p-4 space-y-4">
                      {properties.map((property) => (
                        <PropertyListItem
                          key={property.id}
                          property={property}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {properties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          compact
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 py-6">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        Précédent
                      </Button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium ${
                                page === pageNum
                                  ? "bg-accent text-ink"
                                  : "bg-surface text-primary-600 hover:bg-primary-50 border border-primary-200"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        Suivant
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Vue carte */}
            <div
              className={`${viewMode === "list" ? "hidden lg:block lg:w-1/2" : "w-full"} h-full`}
            >
              <DynamicMapContainer className="h-full w-full">
                <DynamicMapMarkers properties={properties} />
              </DynamicMapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau de filtres mobile (slide over) */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-surface shadow-xl overflow-y-auto animate-slide-in-right">
            <div className="flex justify-between items-center p-4 border-b border-primary-100">
              <h2 className="font-heading text-lg">Filtres</h2>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                aria-label="Fermer les filtres"
                className="text-primary-400 hover:text-primary-600"
              >
                ✕
              </button>
            </div>
            <FiltersPanel />
          </div>
        </div>
      )}
    </div>
  );
}
