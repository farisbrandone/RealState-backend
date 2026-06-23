'use client';

import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '@/shared/api/endpoints/notification.endpoints';
import { useNotificationsStore } from '../stores/notifications.store';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export const useNotifications = () => {
  const userId = useAuthStore(s => s.user?.id);
  const setNotifications = useNotificationsStore(s => s.setNotifications);

  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const { data } = await notificationApi.getUserNotifications(userId!, {
        limit: 20,
        offset: 0,
      });
      setNotifications(data.data);
      // Calculer les non lus
      const unread = data.data.filter((n: any) => n.status !== 'read').length;
      useNotificationsStore.getState().setUnreadCount(unread);
      return data;
    },
    enabled: !!userId,
    refetchInterval: 30000, // Polling toutes les 30s
    staleTime: 20 * 1000,
  });
};
