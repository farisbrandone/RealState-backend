'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyManagementApi } from '@/shared/api/endpoints/property-management.endpoints';
import { toast } from 'react-hot-toast';

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertyManagementApi.delete(id),
    onSuccess: () => {
      toast.success('Propriété supprimée');
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });
};
