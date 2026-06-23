'use client';

import { useMutation } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (payload: {
      conversationId: string;
      content: string;
      type?: 'TEXT' | 'IMAGE' | 'FILE';
      replyToId?: string;
    }) => chatApi.sendMessage(payload),
  });
};
