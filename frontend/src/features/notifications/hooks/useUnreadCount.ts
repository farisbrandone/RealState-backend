import { useNotificationsStore } from '../stores/notifications.store';
export const useUnreadNotificationCount = () => useNotificationsStore(s => s.unreadCount);
