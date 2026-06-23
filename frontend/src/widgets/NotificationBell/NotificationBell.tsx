'use client';

import { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useNotificationsStore } from '@/features/notifications/stores/notifications.store';
import { useChatStore } from '@/features/chat/stores/chat.store';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Charger les notifications via le hook (polling)
  useNotifications();

  const notifications = useNotificationsStore(s => s.notifications);
  const unreadNotifCount = useNotificationsStore(s => s.unreadCount);
  const unreadChatCount = useChatStore(s => s.totalUnread);
  const totalUnread = unreadNotifCount + unreadChatCount;

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1 text-primary-200 hover:text-white transition-colors"
      >
        <BellIcon className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-card overflow-hidden z-50">
          <div className="p-3 border-b border-primary-100 flex justify-between items-center">
            <h3 className="font-heading text-primary-900">Notifications</h3>
            <Link
              href="/notifications"
              className="text-sm text-accent hover:text-accent-dark"
              onClick={() => setOpen(false)}
            >
              Voir tout
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <p className="p-4 text-sm text-primary-400 text-center">Aucune notification</p>
            ) : (
              recentNotifications.map(notif => (
                <button
                  key={notif.id}
                  onClick={() => {
                    if (notif.content.actionUrl) {
                      router.push(notif.content.actionUrl);
                    }
                    setOpen(false);
                    // Marquer comme lue
                    useNotificationsStore.getState().markAsRead(notif.id);
                  }}
                  className={`w-full text-left p-3 hover:bg-primary-50 border-b border-primary-100 transition-colors ${
                    notif.status !== 'read' ? 'bg-primary-50/50' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <p className="text-sm font-medium truncate">{notif.content.title}</p>
                    {notif.status !== 'read' && (
                      <span className="h-2 w-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-primary-500 truncate mt-0.5">{notif.content.body}</p>
                  <p className="text-xs text-primary-400 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
