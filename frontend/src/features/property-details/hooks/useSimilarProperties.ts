'use client';

import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '@/shared/api/endpoints/property.endpoints';
import { PropertySearchResult } from '@/features/property-search/types';

export const useSimilarProperties = (property: {
  city?: string;
  type?: string;
  price?: number;
  excludeId?: string;
}) => {
  const filters: any = {};
  if (property.city) filters['location.city'] = property.city;
  if (property.type) filters.propertyType = [property.type];
  if (property.price) {
    filters.priceRange = {
      min: property.price * 0.8,
      max: property.price * 1.2,
    };
  }

  return useQuery<{ items: PropertySearchResult[] }>({
    queryKey: ['similarProperties', property],
    queryFn: async () => {
      const { data } = await propertyApi.search({ ...filters, limit: 4 });
      return data;
    },
    enabled: !!property.city,
    staleTime: 10 * 60 * 1000,
    select: data => ({
      items: data.items.filter((item: any) => item.id !== property.excludeId).slice(0, 4),
    }),
  });
};
