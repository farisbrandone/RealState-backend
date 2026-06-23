"use client";

import { useConversations } from "@/features/chat/hooks/useConversations";
import { useChatStore } from "@/features/chat/stores/chat.store";
import { Conversation } from "@/features/chat/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const ChatSidebar: React.FC = () => {
  const { data: conversations, isLoading } = useConversations();
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActive = useChatStore((s) => s.setActiveConversation);
  const unreadCounts = useChatStore((s) => s.unreadCounts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations =
    conversations?.filter((conv: Conversation) => {
      if (!searchTerm) return true;
      const participantName =
        conv.participants[0]?.user?.firstName +
        " " +
        conv.participants[0]?.user?.lastName;
      return (
        participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.lastMessage?.content
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }) || [];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* En-tête */}
      <div className="p-4 border-b border-primary-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-lg">Messages</h2>
          <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
            <PlusIcon className="h-5 w-5 text-primary-500" />
          </button>
        </div>
        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher une conversation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-lg bg-primary-50 text-sm border-0 focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-primary-100 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-primary-100 rounded w-1/2" />
                  <div className="h-3 bg-primary-50 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-primary-400 text-sm">
            {searchTerm
              ? "Aucune conversation trouvée"
              : "Pas encore de messages"}
          </div>
        ) : (
          filteredConversations.map((conv: Conversation) => (
            <button
              key={conv.id}
              onClick={() => setActive(conv.id)}
              className={`w-full text-left p-4 hover:bg-primary-50 border-b border-primary-50 transition-colors ${
                activeId === conv.id ? "bg-primary-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      conv.participants[0]?.user?.avatarUrl ||
                      "/images/avatar-placeholder.png"
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {(unreadCounts[conv.id] || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCounts[conv.id]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium truncate">
                      {conv.participants[0]?.user?.firstName}{" "}
                      {conv.participants[0]?.user?.lastName}
                    </p>
                    {conv.lastMessage?.sentAt && (
                      <span className="text-xs text-primary-400 flex-shrink-0 ml-2">
                        {formatDistanceToNow(
                          new Date(conv.lastMessage.sentAt),
                          { addSuffix: true, locale: fr },
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-primary-500 truncate mt-0.5">
                    {conv.lastMessage?.content || "Démarrez la conversation"}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
