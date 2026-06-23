'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/shared/api/endpoints/notification.endpoints';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export const useNotificationPreferences = () => {
  const userId = useAuthStore(s => s.user?.id);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notificationPreferences', userId],
    queryFn: () => notificationApi.getPreferences(userId!),
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => notificationApi.updatePreferences(userId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences', userId] });
    },
  });

  return {
    preferences: query.data?.data,
    isLoading: query.isLoading,
    updatePreferences: mutation.mutate,
  };
};
