'use client';

import { useQuery } from '@tanstack/react-query';
import { propertyManagementApi } from '@/shared/api/endpoints/property-management.endpoints';

export const useMyProperties = (ownerId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['myProperties', ownerId, page],
    queryFn: () => propertyManagementApi.listMyProperties({ ownerId, page, limit }),
    enabled: !!ownerId,
    keepPreviousData: true,
  });
};
