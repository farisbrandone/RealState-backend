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
} from "@heroicons/react/24/outline";
import { FiltersPanel } from "@/widgets/FiltersPanel/FiltersPanel";

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

  const properties = results?.items || [];
  const total = results?.total || 0;
  const totalPages = results?.totalPages || 0;

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    useSearchStore
      .getState()
      .setFilters({
        ...filters,
        sortBy: field,
        sortOrder: sortOrder === "asc" ? "desc" : "asc",
      });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Barre de recherche collante en haut */}
      <div className="sticky top-[73px] z-40 bg-white border-b border-primary-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <SearchBar compact />
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px-80px)]">
        {/* Panneau de filtres (desktop) */}
        <aside className="hidden lg:block w-80 bg-white border-r border-primary-100 overflow-y-auto">
          <FiltersPanel />
        </aside>

        {/* Zone principale */}
        <div className="flex-1 flex flex-col">
          {/* Barre d'outils */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-primary-100">
            <div>
              <h1 className="text-lg font-heading">
                {total} bien{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Filtres mobiles */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-1 px-3 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100"
              >
                <FunnelIcon className="h-5 w-5" />
                Filtres
              </button>

              {/* Tri */}
              <div className="flex items-center gap-2">
                <ArrowsUpDownIcon className="h-5 w-5 text-primary-400" />
                <select
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

              {/* Vue carte/liste */}
              <div className="flex border border-primary-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-accent text-white" : "bg-white text-primary-500"}`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 ${viewMode === "map" ? "bg-accent text-white" : "bg-white text-primary-500"}`}
                >
                  <MapIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal : liste et/ou carte */}
          <div className="flex-1 flex overflow-hidden">
            {/* Vue liste */}
            <div
              className={`${viewMode === "map" ? "hidden lg:block lg:w-1/2" : "w-full"} overflow-y-auto`}
            >
              {isLoading ? (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-xl" />
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <MapIcon className="h-16 w-16 text-primary-200 mb-4" />
                  <h3 className="text-xl font-heading mb-2">
                    Aucun bien trouvé
                  </h3>
                  <p className="text-primary-500 mb-4">
                    Essayez d'élargir vos critères de recherche.
                  </p>
                  <Button variant="outline" onClick={() => setFilters({})}>
                    Réinitialiser les filtres
                  </Button>
                </div>
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
                                  ? "bg-accent text-white"
                                  : "bg-white text-primary-600 hover:bg-primary-50 border border-primary-200"
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
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto animate-slide-in-right">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-heading text-lg">Filtres</h2>
              <button
                onClick={() => setShowFilters(false)}
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
