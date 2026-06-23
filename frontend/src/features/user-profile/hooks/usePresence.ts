// features/user-profile/hooks/usePresence.ts
"use client";

import { useState, useEffect } from "react";
import { useChatStore } from "@/features/chat/stores/chat.store";

export const usePresence = (userId: string) => {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    // Simuler la présence via WebSocket (à connecter au backend)
    const checkPresence = () => {
      // Exemple : vérifier dans le store
      setOnline(Math.random() > 0.5); // temporaire
    };
    checkPresence();
    const interval = setInterval(checkPresence, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  return { online };
};
