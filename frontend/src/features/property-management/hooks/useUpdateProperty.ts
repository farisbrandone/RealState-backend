'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyManagementApi } from '@/shared/api/endpoints/property-management.endpoints';
import { toast } from 'react-hot-toast';

export const useUpdateProperty = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => propertyManagementApi.update(id, data),
    onSuccess: () => {
      toast.success('Propriété mise à jour');
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
};
