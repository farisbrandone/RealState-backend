"use client";

import { useConversations } from "@/features/chat/hooks/useConversations";
import { useChatStore } from "@/features/chat/stores/chat.store";
import { Conversation } from "@/features/chat/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const ChatSidebar: React.FC = () => {
  const { data: conversations, isLoading } = useConversations();
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActive = useChatStore((s) => s.setActiveConversation);
  const unreadCounts = useChatStore((s) => s.unreadCounts);
  console.log({ conversations });
  return (
    <div className="h-full bg-surface border-r border-primary-100 flex flex-col">
      <div className="p-4 border-b border-primary-100">
        <h2 className="font-heading text-lg">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="p-4 text-sm text-primary-500">Chargement...</p>
        ) : (
          conversations?.map((conv: Conversation) => (
            <button
              key={conv.id}
              onClick={() => setActive(conv.id)}
              className={`w-full text-left p-4 hover:bg-primary-50 border-b border-primary-100 transition-colors ${
                activeId === conv.id ? "bg-primary-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      conv.participants[0]?.user.avatarUrl ||
                      "/images/avatar-placeholder.png"
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {unreadCounts[conv.id] > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCounts[conv.id]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {conv.participants[0]?.user.firstName}{" "}
                    {conv.participants[0]?.user.lastName}
                  </p>
                  <p className="text-sm text-primary-500 truncate">
                    {conv.lastMessage?.content || "Nouvelle conversation"}
                  </p>
                </div>
                <span className="text-xs text-primary-400">
                  {conv.lastMessage?.sentAt
                    ? formatDistanceToNow(new Date(conv.lastMessage.sentAt), {
                        addSuffix: true,
                        locale: fr,
                      })
                    : ""}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
