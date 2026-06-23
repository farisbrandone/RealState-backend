'use client';

import { useCallback, useRef } from 'react';
import { chatApi } from '../api/chat.api';

export const useTyping = (conversationId: string) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const startTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      chatApi.startTyping(conversationId);
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      chatApi.stopTyping(conversationId);
      isTypingRef.current = false;
    }, 2000);
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      chatApi.stopTyping(conversationId);
      isTypingRef.current = false;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [conversationId]);

  return { startTyping, stopTyping };
};
