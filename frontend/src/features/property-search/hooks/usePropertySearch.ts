"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { searchApi } from "@/shared/api/endpoints/search.endpoints";
import { useSearchStore } from "../stores/search.store";
import { useDebounce } from "@/shared/hooks/useDebounce";

export const usePropertySearch = () => {
  const filters = useSearchStore((s) => s.filters);
  const page = useSearchStore((s) => s.page);
  const setResults = useSearchStore((s) => s.setResults);
  const debouncedFilters = useDebounce(filters, 300);

  console.log({ filters });

  return useQuery({
    queryKey: ["propertySearch", debouncedFilters, page],
    queryFn: async () => {
      const res = await searchApi.search(debouncedFilters, page);
      setResults(res.data);
      return res.data;
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData, // <-- changement ici
  });
};
