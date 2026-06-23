'use client';

import { useState } from 'react';
import { MAPTILER_CONFIG } from '@/shared/config/maptiler.config';

export const useGeocoding = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_CONFIG.apiKey}&limit=5`,
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, search };
};
