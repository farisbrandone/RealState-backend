"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSearchStore } from "@/features/property-search/stores/search.store";
import { getActiveFilterPills } from "@/features/property-search/lib/filter-pills";

export const ActiveFilterPills: React.FC = () => {
  const filters = useSearchStore((s) => s.filters);
  const setFilters = useSearchStore((s) => s.setFilters);

  const pills = getActiveFilterPills(filters);
  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-primary-100 bg-surface">
      {pills.map((pill) => (
        <button
          key={pill.key}
          type="button"
          onClick={() => setFilters(pill.remove(filters))}
          className="group flex items-center gap-1.5 rounded-full bg-primary-100 py-1 pl-3 pr-2 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-200"
        >
          {pill.label}
          <XMarkIcon className="h-3.5 w-3.5 text-primary-500 group-hover:text-primary-700" />
        </button>
      ))}
      {pills.length > 1 && (
        <button
          type="button"
          onClick={() =>
            setFilters({
              transactionType: filters.transactionType,
              propertyType: undefined,
              priceRange: undefined,
              location: undefined,
              features: undefined,
            })
          }
          className="text-xs font-medium text-accent-dark hover:underline"
        >
          Tout effacer
        </button>
      )}
    </div>
  );
};
