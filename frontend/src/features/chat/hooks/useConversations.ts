'use client';

import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import { useChatStore } from '../stores/chat.store';
import { useEffect } from 'react';

export const useConversations = () => {
  const setConversations = useChatStore(s => s.setConversations);

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await chatApi.getConversations();
      setConversations(data);
      return data;
    },
    staleTime: 30 * 1000,
  });

  return query;
};
