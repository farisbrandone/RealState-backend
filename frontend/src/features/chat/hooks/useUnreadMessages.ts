'use client';

import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import { useChatStore } from '../stores/chat.store';
import { useEffect } from 'react';

export const useUnreadMessages = () => {
  const setTotalUnread = useChatStore(s => s.setTotalUnread);

  const query = useQuery({
    queryKey: ['unread'],
    queryFn: async () => {
      const { data } = await chatApi.getUnread();
      setTotalUnread(data.total || 0);
      return data;
    },
    refetchInterval: 30000, // toutes les 30s en fallback
  });

  return query;
};
