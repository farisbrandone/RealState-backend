'use client';

import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/shared/api/endpoints/search.endpoints';
import { useState } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';

export const useAutocomplete = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['autocomplete', debouncedQuery],
    queryFn: () => searchApi.autocomplete(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30 * 1000,
  });

  return {
    query,
    setQuery,
    suggestions: suggestions?.data || [],
    isLoading,
  };
};
