import httpClient from '@/shared/api/clients/http.client';

export const chatApi = {
  getConversations: () => httpClient.get('/chat/conversations'),
  getConversation: (id: string) => httpClient.get(`/chat/conversations/${id}`),
  createConversation: (data: any) => httpClient.post('/chat/conversations', data),
  deleteConversation: (id: string) => httpClient.delete(`/chat/conversations/${id}`),

  getMessages: (conversationId: string, params?: any) =>
    httpClient.get(`/chat/messages/conversation/${conversationId}`, { params }),
  sendMessage: (data: any) => httpClient.post('/chat/messages', data),
  editMessage: (id: string, content: string) => httpClient.put(`/chat/messages/${id}`, { content }),
  deleteMessage: (id: string) => httpClient.delete(`/chat/messages/${id}`),

  markAsRead: (conversationId: string, messageId: string) =>
    httpClient.post('/chat/messages/read', { conversationId, messageId }),

  uploadAttachment: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post<{ id: string; url: string; type: string }>(
      '/chat/attachments',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  startTyping: (conversationId: string) =>
    httpClient.post('/chat/typing/start', { conversationId }),
  stopTyping: (conversationId: string) => httpClient.post('/chat/typing/stop', { conversationId }),

  getUnread: () => httpClient.get('/chat/unread'),
};
