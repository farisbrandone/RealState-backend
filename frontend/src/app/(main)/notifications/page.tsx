"use client";

import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useNotificationsStore } from "@/features/notifications/stores/notifications.store";
import { Card } from "@/shared/ui/components/Card/Card";
import { Button } from "@/shared/ui/components/Button/Button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { BellIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function NotificationsPage() {
  useNotifications(); // polling
  const notifications = useNotificationsStore((s) => s.notifications);
  const markAsRead = useNotificationsStore((s) => s.markAsRead);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => n.status !== "read")
      : notifications;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading flex items-center gap-2">
          <BellIcon className="h-6 w-6" />
          Notifications
        </h1>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Toutes
          </Button>
          <Button
            variant={filter === "unread" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Non lues
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <BellIcon className="h-12 w-12 text-primary-200 mx-auto mb-4" />
            <p className="text-primary-500">
              {filter === "unread"
                ? "Aucune notification non lue"
                : "Aucune notification"}
            </p>
          </Card>
        ) : (
          filtered.map((notif) => (
            <Card
              key={notif.id}
              padding="md"
              className={`flex items-start gap-4 ${notif.status !== "read" ? "bg-accent/5 border-l-4 border-accent" : ""}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{notif.content.title}</h3>
                  {notif.status !== "read" && (
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
                <p className="text-sm text-primary-600">{notif.content.body}</p>
                <p className="text-xs text-primary-400 mt-2">
                  {formatDistanceToNow(new Date(notif.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>
              {notif.status !== "read" && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-primary-400 hover:text-green-500 transition-colors p-1"
                  title="Marquer comme lu"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
