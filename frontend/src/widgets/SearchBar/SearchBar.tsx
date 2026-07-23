"use client";

import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { useSearchStore } from "@/features/property-search/stores/search.store";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/components/Button/Button";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  LocationSuggestion,
  useLocationSearch,
} from "@/shared/hooks/useLocationSearch";
import { getActiveFilterPills } from "@/features/property-search/lib/filter-pills";

interface SearchBarProps {
  compact?: boolean;
}

const typeIconFor = (type: LocationSuggestion["type"]) => {
  switch (type) {
    case "country":
      return GlobeAltIcon;
    case "city":
      return BuildingOfficeIcon;
    default:
      return MapPinIcon;
  }
};

const typeLabelFor = (type: LocationSuggestion["type"]) => {
  switch (type) {
    case "country":
      return "Pays";
    case "city":
      return "Ville";
    default:
      return "Quartier";
  }
};

export const SearchBar: React.FC<SearchBarProps> = ({ compact = false }) => {
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownRect, setDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const filters = useSearchStore((s) => s.filters);
  const setFilters = useSearchStore((s) => s.setFilters);
  const { suggestions } = useLocationSearch(query);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const updateDropdownPosition = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownRect({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (showSuggestions) updateDropdownPosition();
  }, [showSuggestions, suggestions, updateDropdownPosition]);

  useEffect(() => {
    if (!showSuggestions) return;
    const handle = () => updateDropdownPosition();
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, [showSuggestions, updateDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideInput = wrapperRef.current?.contains(target);
      const clickedInsideDropdown = document
        .getElementById("search-location-dropdown")
        ?.contains(target);
      if (!clickedInsideInput && !clickedInsideDropdown) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => setHighlightIndex(0), [suggestions]);

  const applyLocation = (loc: LocationSuggestion) => {
    setSelectedLocation(loc);
    setQuery(loc.path);
    setShowSuggestions(false);
    setFilters({
      ...filters,
      location: {
        country: loc.country,
        city: loc.city,
        neighborhood: loc.neighborhood,
        geoPoint: { latitude: loc.lat, longitude: loc.lon },
      },
      radius,
    });
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setQuery("");
    setFilters({ ...filters, location: undefined });
  };

  const handleSearch = () => {
    if (!selectedLocation && query.trim() && suggestions.length > 0) {
      applyLocation(suggestions[0]);
    } else if (!selectedLocation && query.trim()) {
      setFilters({
        ...filters,
        location: { city: query.trim() },
        radius,
      });
    }
    router.push("/search");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") handleSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex(
        (i) => (i - 1 + suggestions.length) % suggestions.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      applyLocation(suggestions[highlightIndex]);
      router.push("/search");
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const dropdownContent =
    mounted && showSuggestions && dropdownRect
      ? createPortal(
          <div
            id="search-location-dropdown"
            style={{
              position: "absolute",
              top: dropdownRect.top,
              left: dropdownRect.left,
              width: dropdownRect.width,
              zIndex: 9999,
            }}
          >
            {suggestions.length > 0 ? (
              <ul className="max-h-72 w-full overflow-auto rounded-xl border border-primary-100 bg-surface shadow-card">
                {suggestions.map((item, idx) => {
                  const Icon = typeIconFor(item.type);
                  const active = idx === highlightIndex;
                  return (
                    <li
                      key={`${item.type}-${item.path}`}
                      onMouseEnter={() => setHighlightIndex(idx)}
                      onClick={() => applyLocation(item)}
                      className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors ${
                        active ? "bg-accent/10" : "hover:bg-primary-50"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          active ? "bg-accent/20" : "bg-primary-100"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${active ? "text-accent" : "text-primary-500"}`}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-primary-900">
                          {item.label}
                        </span>
                        <span className="block truncate text-xs text-primary-400">
                          {item.path}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-400">
                        {typeLabelFor(item.type)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : query.length > 0 ? (
              <div className="w-full rounded-xl border border-primary-100 bg-surface p-4 text-center text-sm text-primary-400 shadow-card">
                Aucun lieu trouvé pour "{query}". Essayez un pays, une ville ou
                un quartier d'Afrique francophone.
              </div>
            ) : null}
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      className={`${compact ? "p-1.5" : "p-2"} rounded-2xl bg-surface shadow-2xl`}
    >
      <div
        className={`grid gap-2 sm:flex sm:flex-row sm:items-stretch sm:gap-2 ${compact ? "grid-cols-2" : "grid-cols-[1fr_1fr_auto]"}`}
      >
        <select
          className={`order-1 rounded-xl border-0 bg-primary-50 p-3 font-medium text-primary-900 focus:ring-2 focus:ring-accent sm:w-auto ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
          value={filters.transactionType || "sale"}
          onChange={(e) =>
            setFilters({
              ...filters,
              transactionType: e.target.value as "sale" | "rent",
            })
          }
        >
          <option value="sale">🏠 Acheter</option>
          <option value="rent">🔑 Louer</option>
        </select>

        <select
          value={radius}
          onChange={(e) => {
            const r = Number(e.target.value);
            setRadius(r);
            if (selectedLocation) setFilters({ ...filters, radius: r });
          }}
          className={`order-2 rounded-xl border-0 bg-primary-50 p-3 font-medium text-primary-900 focus:ring-2 focus:ring-accent sm:order-3 sm:w-auto ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
        >
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={20}>20 km</option>
          <option value={50}>50 km</option>
          <option value={100}>100 km</option>
        </select>

        {!compact && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative order-3 flex shrink-0 items-center justify-center rounded-xl bg-primary-50 p-3 text-primary-500 transition-colors hover:bg-primary-100 sm:order-5"
            title="Filtres avancés"
            aria-label="Filtres avancés"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            {getActiveFilterPills(filters).length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-ink">
                {getActiveFilterPills(filters).length}
              </span>
            )}
          </button>
        )}

        <div
          ref={wrapperRef}
          className={`relative order-4 sm:order-2 sm:col-span-1 sm:flex-1 ${compact ? "col-span-2" : "col-span-3"}`}
        >
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <MapPinIcon className="h-4 w-4 text-primary-400" />
          </div>
          <input
            type="text"
            placeholder={
              compact
                ? "Ville, quartier..."
                : "Quartier, ville ou pays (ex: Bonapriso, Douala...)"
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedLocation(null);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setShowSuggestions(true);
              updateDropdownPosition();
            }}
            onKeyDown={handleKeyDown}
            className={`w-full rounded-xl bg-primary-50 p-3 pl-9 pr-8 text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
          />
          {query && (
            <button
              onClick={clearLocation}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
              aria-label="Effacer"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          onClick={handleSearch}
          variant="primary"
          size={compact ? "md" : "lg"}
          className={`order-5 w-full shrink-0 rounded-xl px-6 sm:order-4 sm:col-span-1 sm:w-auto ${compact ? "col-span-2" : "col-span-3"}`}
        >
          <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
          Rechercher
        </Button>
      </div>

      {showFilters && (
        <div className="mt-3 grid animate-fade-in grid-cols-2 gap-3 rounded-xl bg-primary-50 p-4 sm:mt-4 sm:grid-cols-4 sm:gap-4">
          <div>
            <label className="mb-1 block text-xs text-primary-500">
              Surface min
            </label>
            <input
              type="number"
              placeholder="0 m²"
              className="w-full rounded-lg border border-primary-200 bg-surface p-2 text-sm"
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setFilters({
                  ...filters,
                  features: { ...filters.features, squareMetersMin: val },
                });
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-primary-500">
              Surface max
            </label>
            <input
              type="number"
              placeholder="500 m²"
              className="w-full rounded-lg border border-primary-200 bg-surface p-2 text-sm"
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setFilters({
                  ...filters,
                  features: { ...filters.features, squareMetersMax: val },
                });
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-primary-500">
              Prix min
            </label>
            <input
              type="number"
              placeholder="0 FCFA"
              className="w-full rounded-lg border border-primary-200 bg-surface p-2 text-sm"
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setFilters({
                  ...filters,
                  priceRange: { ...filters.priceRange, min: val },
                });
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-primary-500">
              Prix max
            </label>
            <input
              type="number"
              placeholder="1 000 000 FCFA"
              className="w-full rounded-lg border border-primary-200 bg-surface p-2 text-sm"
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setFilters({
                  ...filters,
                  priceRange: { ...filters.priceRange, max: val },
                });
              }}
            />
          </div>
        </div>
      )}

      {dropdownContent}
    </div>
  );
};
