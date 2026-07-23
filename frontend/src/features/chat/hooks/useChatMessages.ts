'use client';

import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import { useChatStore } from '../stores/chat.store';
import { useEffect } from 'react';
import { getChatSocket } from '../websocket/chat.socket';

export const useChatMessages = (conversationId: string | null) => {
  const setMessages = useChatStore(s => s.setMessages);
  const markAsRead = useChatStore(s => s.markAsRead);

  // Une conversation qui vient d'être créée (ou toute conversation ouverte
  // après l'établissement du socket) n'a pas de room WebSocket rejointe par
  // défaut — sans ça, ni l'expéditeur ni les mises à jour temps réel
  // n'apparaissent tant que la page n'est pas rechargée.
  useEffect(() => {
    if (!conversationId) return;
    getChatSocket().emit('joinConversation', { conversationId });
  }, [conversationId]);

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
