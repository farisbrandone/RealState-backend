'use client';

import { useQuery } from '@tanstack/react-query';
import httpClient from '@/shared/api/clients/http.client';

export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const { data } = await httpClient.get(`/users/${userId}/profile`);
      return data;
    },
    enabled: !!userId,
  });
};
