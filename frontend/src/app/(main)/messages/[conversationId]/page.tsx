"use client";

import { useParams, useRouter } from "next/navigation";
import { ChatWindow } from "@/widgets/ChatWindow/ChatWindow";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;

  return (
    <ChatWindow
      conversationId={conversationId}
      onBack={() => router.push("/messages")}
    />
  );
}
