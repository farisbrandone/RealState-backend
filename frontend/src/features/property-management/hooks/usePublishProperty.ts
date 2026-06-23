'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyManagementApi } from '@/shared/api/endpoints/property-management.endpoints';
import { toast } from 'react-hot-toast';

export const usePublishProperty = () => {
  const queryClient = useQueryClient();

  const publish = useMutation({
    mutationFn: (id: string) => propertyManagementApi.publish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myProperties'] }),
  });

  const unpublish = useMutation({
    mutationFn: (id: string) => propertyManagementApi.unpublish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myProperties'] }),
  });

  return { publish, unpublish };
};
