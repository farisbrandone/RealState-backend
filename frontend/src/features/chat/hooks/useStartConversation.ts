'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import { useChatStore } from '../stores/chat.store';
import { Conversation } from '../types';

interface StartConversationInput {
  agentId: string;
  propertyId?: string;
}

// Le backend est idempotent pour les conversations DIRECT (voir
// ChatApplicationService.createConversation) : appeler ceci plusieurs fois
// pour le même agent renvoie toujours le même fil, jamais un doublon.
export const useStartConversation = () => {
  const queryClient = useQueryClient();
  const addConversation = useChatStore(s => s.addConversation);
  const setActiveConversation = useChatStore(s => s.setActiveConversation);

  return useMutation({
    mutationFn: async ({ agentId, propertyId }: StartConversationInput) => {
      const { data } = await chatApi.createConversation({
        type: 'DIRECT',
        participantIds: [agentId],
        propertyId,
      });
      return data as Conversation;
    },
    onSuccess: conversation => {
      addConversation(conversation);
      setActiveConversation(conversation.id);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
