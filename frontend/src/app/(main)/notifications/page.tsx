'use client';

import { useState } from 'react';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useNotificationsStore } from '@/features/notifications/stores/notifications.store';
import { Card } from '@/shared/ui/components/Card/Card';
import { Button } from '@/shared/ui/components/Button/Button';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationsPage() {
  const { isLoading, isError } = useNotifications();
  const notifications = useNotificationsStore(s => s.notifications);
  const markAsRead = useNotificationsStore(s => s.markAsRead);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered =
    filter === 'unread' ? notifications.filter(n => n.status !== 'read') : notifications;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading">Notifications</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Toutes
          </Button>
          <Button
            variant={filter === 'unread' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Non lues
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-primary-500">Chargement...</p>}
      {isError && <p className="text-red-500">Erreur lors du chargement.</p>}

      <div className="space-y-3">
        {filtered.map(notif => (
          <Card key={notif.id} padding="md" className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{notif.content.title}</h3>
                {notif.status !== 'read' && <span className="h-2 w-2 rounded-full bg-accent" />}
              </div>
              <p className="text-sm text-primary-600 mt-1">{notif.content.body}</p>
              <p className="text-xs text-primary-400 mt-2">
                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              {notif.status !== 'read' && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="p-1 text-primary-400 hover:text-green-500"
                  title="Marquer comme lue"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              )}
              {/* Optionnel: supprimer */}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && !isLoading && (
          <p className="text-center text-primary-400 py-12">Aucune notification.</p>
        )}
      </div>
    </div>
  );
}
