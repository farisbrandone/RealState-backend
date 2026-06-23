'use client';

import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import { useChatStore } from '../stores/chat.store';
import { useEffect } from 'react';

export const useChatMessages = (conversationId: string | null) => {
  const setMessages = useChatStore(s => s.setMessages);
  const markAsRead = useChatStore(s => s.markAsRead);

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data } = await chatApi.getMessages(conversationId!);
      setMessages(conversationId!, data);
      // Marquer comme lus
      if (data.length > 0) {
        await chatApi.markAsRead(conversationId!, data[data.length - 1].id);
        markAsRead(conversationId!);
      }
      return data;
    },
    enabled: !!conversationId,
  });

  return query;
};
