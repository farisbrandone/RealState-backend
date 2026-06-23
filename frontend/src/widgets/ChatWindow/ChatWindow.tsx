'use client';

import { useParams, useRouter } from 'next/navigation';
import { useChatMessages } from '@/features/chat/hooks/useChatMessages';
import { useChatStore } from '@/features/chat/stores/chat.store';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { useTyping } from '@/features/chat/hooks/useTyping';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export const ChatWindow: React.FC = () => {
  const params = useParams();
  const conversationId = params?.conversationId as string | undefined;
  const activeId = useChatStore(s => s.activeConversationId) || conversationId;
  const messages = useChatStore(s => (activeId ? s.messages[activeId] : [])) || [];
  const typingUsers = useChatStore(s => (activeId ? s.typingUsers[activeId] : [])) || [];
  const currentUser = useAuthStore(s => s.user);
  const { data, isLoading } = useChatMessages(activeId || null);
  const sendMutation = useSendMessage();
  const { startTyping, stopTyping } = useTyping(activeId || '');
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeId) return;
    sendMutation.mutate(
      { conversationId: activeId, content: input, type: 'TEXT' },
      {
        onSuccess: () => setInput(''),
      },
    );
    stopTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  if (!activeId) {
    return (
      <div className="flex-1 flex items-center justify-center text-primary-400">
        Sélectionnez une conversation
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-primary-100 bg-surface flex items-center justify-between">
        <h3 className="font-heading">Conversation</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-xl ${
                  msg.senderId === currentUser?.id
                    ? 'bg-accent text-white rounded-br-none'
                    : 'bg-primary-100 text-primary-900 rounded-bl-none'
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.sentAt).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        {typingUsers.length > 0 && (
          <p className="text-sm text-primary-400 italic">Quelqu'un écrit...</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-primary-100 bg-surface">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Votre message..."
            className="flex-1 resize-none border border-primary-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-accent text-white p-3 rounded-xl hover:bg-accent-dark disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
