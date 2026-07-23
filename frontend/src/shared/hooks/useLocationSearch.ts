import { useMemo, useState } from "react";
import {
  AFRICA_FRANCOPHONE_LOCATIONS,
  CountryData,
} from "@/shared/data/locations.data";

export type LocationSuggestionType = "country" | "city" | "neighborhood";

export interface LocationSuggestion {
  type: LocationSuggestionType;
  label: string; // texte affiché en gras (ex: "Bonapriso")
  path: string; // fil d'ariane complet (ex: "Bonapriso, Douala, Cameroun")
  country: string;
  city?: string;
  neighborhood?: string;
  lat: number;
  lon: number;
}

// Retire les accents pour une comparaison insensible aux accents
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buildAllSuggestions(): LocationSuggestion[] {
  const list: LocationSuggestion[] = [];

  AFRICA_FRANCOPHONE_LOCATIONS.forEach((country: CountryData) => {
    // Niveau pays
    const countryLat = country.cities[0]?.lat ?? 0;
    const countryLon = country.cities[0]?.lon ?? 0;
    list.push({
      type: "country",
      label: country.name,
      path: country.name,
      country: country.name,
      lat: countryLat,
      lon: countryLon,
    });

    country.cities.forEach((city) => {
      // Niveau ville
      list.push({
        type: "city",
        label: city.name,
        path: `${city.name}, ${country.name}`,
        country: country.name,
        city: city.name,
        lat: city.lat,
        lon: city.lon,
      });

      // Niveau quartier
      city.neighborhoods.forEach((n) => {
        list.push({
          type: "neighborhood",
          label: n,
          path: `${n}, ${city.name}, ${country.name}`,
          country: country.name,
          city: city.name,
          neighborhood: n,
          lat: city.lat,
          lon: city.lon,
        });
      });
    });
  });

  return list;
}

const ALL_SUGGESTIONS = buildAllSuggestions();

/**
 * Recherche floue locale : classe les résultats par pertinence
 * (préfixe > mot qui commence par > contient), quartiers/villes/pays mélangés
 * puis triés par type pour un affichage groupé.
 */
function scoreMatch(query: string, target: string): number {
  const q = normalize(query);
  const t = normalize(target);
  if (!q) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.split(/[\s-]/).some((word) => word.startsWith(q))) return 60;
  if (t.includes(q)) return 40;
  return 0;
}

export function useLocationSearch(query: string, limit = 8) {
  const [selected, setSelected] = useState<LocationSuggestion | null>(null);

  const suggestions = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) return [];

    const scored = ALL_SUGGESTIONS.map((s) => ({
      suggestion: s,
      score: Math.max(
        scoreMatch(trimmed, s.label),
        scoreMatch(trimmed, s.path) * 0.9,
      ),
    }))
      .filter((s) => s.score > 0)
      // Priorise quartier > ville > pays à score égal (résultat le plus précis d'abord)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const order = { neighborhood: 0, city: 1, country: 2 };
        return order[a.suggestion.type] - order[b.suggestion.type];
      })
      .slice(0, limit)
      .map((s) => s.suggestion);

    return scored;
  }, [query, limit]);

  return { suggestions, selected, setSelected };
}
