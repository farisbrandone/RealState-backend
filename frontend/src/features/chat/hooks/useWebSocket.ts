'use client';

import { useEffect, useRef } from 'react';
import { getChatSocket, disconnectChatSocket } from '../websocket/chat.socket';
import { WS_EVENTS } from '../websocket/events';
import { useChatStore } from '../stores/chat.store';
import { ChatMessage } from '../types';

export const useWebSocket = (isAuthenticated: boolean) => {
  const store = useChatStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getChatSocket();

    socket.on(WS_EVENTS.NEW_MESSAGE, (message: ChatMessage) => {
      store.addMessage(message);
      if (message.conversationId !== store.activeConversationId) {
        store.incrementUnread(message.conversationId);
      }
    });

    socket.on(
      WS_EVENTS.MESSAGE_UPDATED,
      (data: { messageId: string; updates: Partial<ChatMessage> }) => {
        store.updateMessage(data.messageId, data.updates);
      },
    );

    socket.on(WS_EVENTS.MESSAGE_DELETED, (data: { messageId: string }) => {
      store.deleteMessage(data.messageId);
    });

    socket.on(WS_EVENTS.TYPING_START, (data: { conversationId: string; userId: string }) => {
      const current = store.typingUsers[data.conversationId] || [];
      store.setTypingUsers(data.conversationId, [...new Set([...current, data.userId])]);
    });

    socket.on(WS_EVENTS.TYPING_STOP, (data: { conversationId: string; userId: string }) => {
      const current = store.typingUsers[data.conversationId] || [];
      store.setTypingUsers(
        data.conversationId,
        current.filter(id => id !== data.userId),
      );
    });

    return () => {
      socket.off(WS_EVENTS.NEW_MESSAGE);
      socket.off(WS_EVENTS.MESSAGE_UPDATED);
      socket.off(WS_EVENTS.MESSAGE_DELETED);
      socket.off(WS_EVENTS.TYPING_START);
      socket.off(WS_EVENTS.TYPING_STOP);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      disconnectChatSocket();
    };
  }, []);
};
