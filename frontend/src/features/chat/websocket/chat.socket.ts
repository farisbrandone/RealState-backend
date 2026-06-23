import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/stores/auth.store';

const WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL || 'ws://localhost:3008';

let socket: Socket | null = null;

export const getChatSocket = (): Socket => {
  if (!socket || !socket.connected) {
    const token = useAuthStore.getState().accessToken;
    socket = io(WS_URL, {
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
