"use client";

import { useState } from "react";
import { ChatSidebar } from "@/widgets/ChatSidebar/ChatSidebar";
import { ChatWindow } from "@/widgets/ChatWindow/ChatWindow";
import { useChatStore } from "@/features/chat/stores/chat.store";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

export default function MessagesPage() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-primary-50">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar && activeConversationId ? "hidden md:block" : "block"
        } w-full md:w-96 flex-shrink-0 border-r border-primary-100 bg-white`}
      >
        <ChatSidebar onSelectConversation={() => setShowSidebar(false)} />
      </div>

      {/* Zone de chat */}
      <div
        className={`${!activeConversationId ? "hidden md:flex" : "flex"} flex-1 flex-col`}
      >
        {activeConversationId ? (
          <ChatWindow
            conversationId={activeConversationId}
            onBack={() => setShowSidebar(true)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-primary-400">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChatBubbleLeftEllipsisIcon className="h-10 w-10 text-primary-300" />
              </div>
              <h3 className="text-xl font-heading text-primary-700 mb-2">
                Vos messages
              </h3>
              <p className="text-sm max-w-xs">
                Sélectionnez une conversation ou contactez un agent depuis une
                annonce.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
