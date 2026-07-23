import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/stores/auth.store';

const WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL || 'ws://localhost:3002';

let socket: Socket | null = null;

export const getChatSocket = (): Socket => {
  if (!socket || !socket.connected) {
    const token = useAuthStore.getState().accessToken;
    // Le gateway backend est déclaré sous le namespace '/chat'
    // (@WebSocketGateway({ namespace: '/chat' })) : se connecter à la racine
    // rejoint le namespace par défaut '/', où aucun handler n'écoute jamais
    // — ni handleConnection (donc pas d'auth, pas de rooms), ni les
    // messages temps réel. D'où l'absence totale de mise à jour live.
    socket = io(`${WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socket;
};

export const disconnectChatSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
