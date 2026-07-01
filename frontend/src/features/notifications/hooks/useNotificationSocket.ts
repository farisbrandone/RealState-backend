// features/notifications/hooks/useNotificationSocket.ts
"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useNotificationsStore } from "../stores/notifications.store";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000";

let socket: Socket | null = null;

export const useNotificationSocket = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const addNotification = useNotificationsStore((s) => s.addNotification);

  useEffect(() => {
    if (!accessToken) return;

    socket = io(`${WS_URL}/notifications`, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    socket.on("notification", (notification) => {
      addNotification(notification);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [accessToken]);

  // On peut aussi garder le polling en fallback, mais on peut le désactiver si le socket est connecté.
};
