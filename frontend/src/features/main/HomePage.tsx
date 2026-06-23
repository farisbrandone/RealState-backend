'use client';

import { SearchBar } from '@/widgets/SearchBar/SearchBar';
import { MapMarkers } from '@/features/map/components/MapMarkers/MapMarkers';
import { usePropertySearch } from '@/features/property-search/hooks/usePropertySearch';
import { useSearchStore } from '@/features/property-search/stores/search.store';
import { PropertyCard } from '@/widgets/PropertyCard/PropertyCard';
import { Skeleton } from '@/shared/ui/components/Skeleton/Skeleton';
import dynamic from 'next/dynamic';

const DynamicMapContainer = dynamic(
  () => import('@/features/map/components/MapContainer/MapContainer').then(mod => mod.MapContainer),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[70vh] w-full" />,
  },
);

export function HomePageClient() {
  const { data: searchData, isLoading, isError } = usePropertySearch();
  const viewMode = useSearchStore(s => s.viewMode);
  const setViewMode = useSearchStore(s => s.setViewMode);
  const results = useSearchStore(s => s.results);
  const setPage = useSearchStore(s => s.setPage);
  const page = useSearchStore(s => s.page);

  const properties = results?.items || [];

  return (
    <div>
      {/* Hero avec barre de recherche */}
      <section className="relative bg-primary-900 py-20 px-4">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Trouvez votre bien d'exception
          </h1>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Découvrez une sélection de biens immobiliers de prestige.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Contenu principal : carte + liste */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading">Résultats</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-900' : 'text-primary-500'}`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md ${viewMode === 'map' ? 'bg-primary-100 text-primary-900' : 'text-primary-500'}`}
            >
              Carte
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Vue carte */}
          <div className={`${viewMode === 'map' ? 'lg:flex-1 h-[70vh]' : 'hidden'}`}>
            <DynamicMapContainer>
              <MapMarkers properties={properties} />
            </DynamicMapContainer>
          </div>

          {/* Vue liste */}
          <div className={`${viewMode === 'list' ? 'flex-1' : 'lg:w-1/2'}`}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <p>Erreur lors du chargement des propriétés.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map(p => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
                {/* Pagination simple */}
                {results && results.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: results.totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-4 py-2 rounded-md ${p === page ? 'bg-accent text-white' : 'bg-primary-100'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}