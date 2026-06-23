'use client';

import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '@/shared/api/endpoints/property.endpoints';
import { PropertyDetail } from '../types';

export const useProperty = (id: string) => {
  return useQuery<PropertyDetail>({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data } = await propertyApi.getById(id);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
