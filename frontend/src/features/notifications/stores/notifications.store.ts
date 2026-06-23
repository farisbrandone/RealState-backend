import { create } from 'zustand';
import { NotificationItem } from '../types';

interface NotificationsState {
  notifications: NotificationItem[];
  unreadCount: number;
  setNotifications: (notifications: NotificationItem[]) => void;
  addNotification: (notification: NotificationItem) => void;
  markAsRead: (id: string) => void;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
}

export const useNotificationsStore = create<NotificationsState>(set => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: notifications => set({ notifications }),
  addNotification: notification =>
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: id =>
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, status: 'read' as const } : n,
      ),
      unreadCount: state.notifications.filter(n => n.id === id && n.status !== 'read').length
        ? state.unreadCount - 1
        : state.unreadCount,
    })),
  setUnreadCount: count => set({ unreadCount: count }),
  incrementUnread: () => set(state => ({ unreadCount: state.unreadCount + 1 })),
}));
