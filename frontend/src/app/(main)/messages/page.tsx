"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatSidebar } from "@/widgets/ChatSidebar/ChatSidebar";
import { ChatWindow } from "@/widgets/ChatWindow/ChatWindow";
import { useChatStore } from "@/features/chat/stores/chat.store";
import { useStartConversation } from "@/features/chat/hooks/useStartConversation";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { EmptyState } from "@/shared/ui/components/EmptyState/EmptyState";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";

export default function MessagesPage() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const [showSidebar, setShowSidebar] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const startConversation = useStartConversation();
  const requestedAgentId = useRef<string | null>(null);

  const agentId = searchParams.get("agentId");
  const propertyId = searchParams.get("propertyId") || undefined;

  // Arrivée depuis "Contacter l'agent" (fiche agent ou annonce) : on
  // ouvre/crée la conversation avec cet agent, puis on nettoie l'URL pour
  // qu'un rafraîchissement de page ne relance pas la création.
  useEffect(() => {
    if (!agentId || requestedAgentId.current === agentId) return;
    requestedAgentId.current = agentId;
    startConversation.mutate(
      { agentId, propertyId },
      { onSettled: () => router.replace("/messages") },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId, propertyId]);

  const openingConversation = !!agentId && startConversation.isPending;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-primary-50">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar && activeConversationId ? "hidden md:block" : "block"
        } w-full md:w-96 flex-shrink-0 border-r border-primary-100 bg-surface`}
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
        ) : openingConversation ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <p className="text-sm text-primary-500">
              Ouverture de la conversation...
            </p>
          </div>
        ) : startConversation.isError ? (
          <EmptyState
            className="flex-1"
            icon={<ChatBubbleLeftEllipsisIcon className="h-9 w-9" />}
            title="Impossible d'ouvrir la conversation"
            description="Une erreur est survenue. Réessayez depuis la fiche de l'agent."
          />
        ) : (
          <EmptyState
            className="flex-1"
            icon={<ChatBubbleLeftEllipsisIcon className="h-9 w-9" />}
            title="Vos messages"
            description="Sélectionnez une conversation ou contactez un agent depuis une annonce."
          />
        )}
      </div>
    </div>
  );
}
