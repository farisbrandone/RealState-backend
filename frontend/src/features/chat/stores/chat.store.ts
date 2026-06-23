import { create } from 'zustand';
import { Conversation, ChatMessage } from '../types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>; // conversationId -> messages
  typingUsers: Record<string, string[]>; // conversationId -> userIds
  unreadCounts: Record<string, number>; // conversationId -> count
  totalUnread: number;

  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  removeConversation: (id: string) => void;

  setActiveConversation: (id: string | null) => void;

  setMessages: (conversationId: string, messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  deleteMessage: (messageId: string) => void;

  setTypingUsers: (conversationId: string, userIds: string[]) => void;

  setUnreadCount: (conversationId: string, count: number) => void;
  setTotalUnread: (count: number) => void;
  incrementUnread: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  unreadCounts: {},
  totalUnread: 0,

  setConversations: conversations => set({ conversations }),
  addConversation: conversation =>
    set(state => ({ conversations: [conversation, ...state.conversations] })),
  updateConversation: (id, updates) =>
    set(state => ({
      conversations: state.conversations.map(c => (c.id === id ? { ...c, ...updates } : c)),
    })),
  removeConversation: id =>
    set(state => ({
      conversations: state.conversations.filter(c => c.id !== id),
    })),

  setActiveConversation: id => set({ activeConversationId: id }),

  setMessages: (conversationId, messages) =>
    set(state => ({ messages: { ...state.messages, [conversationId]: messages } })),
  addMessage: message =>
    set(state => {
      const convMessages = state.messages[message.conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [message.conversationId]: [...convMessages, message],
        },
      };
    }),
  updateMessage: (messageId, updates) =>
    set(state => {
      const newMessages = { ...state.messages };
      for (const convId in newMessages) {
        newMessages[convId] = newMessages[convId].map(m =>
          m.id === messageId ? { ...m, ...updates } : m,
        );
      }
      return { messages: newMessages };
    }),
  deleteMessage: messageId =>
    set(state => {
      const newMessages = { ...state.messages };
      for (const convId in newMessages) {
        newMessages[convId] = newMessages[convId].filter(m => m.id !== messageId);
      }
      return { messages: newMessages };
    }),

  setTypingUsers: (conversationId, userIds) =>
    set(state => ({
      typingUsers: { ...state.typingUsers, [conversationId]: userIds },
    })),

  setUnreadCount: (conversationId, count) =>
    set(state => {
      const newCounts = { ...state.unreadCounts, [conversationId]: count };
      const total = Object.values(newCounts).reduce((sum, c) => sum + c, 0);
      return { unreadCounts: newCounts, totalUnread: total };
    }),
  setTotalUnread: count => set({ totalUnread: count }),
  incrementUnread: conversationId =>
    set(state => {
      const newCounts = { ...state.unreadCounts };
      newCounts[conversationId] = (newCounts[conversationId] || 0) + 1;
      return { unreadCounts: newCounts, totalUnread: state.totalUnread + 1 };
    }),
  markAsRead: conversationId =>
    set(state => {
      const newCounts = { ...state.unreadCounts, [conversationId]: 0 };
      const total = Object.values(newCounts).reduce((sum, c) => sum + c, 0);
      return { unreadCounts: newCounts, totalUnread: total };
    }),
}));
