// widgets/NotificationBell/NotificationBell.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useNotificationsStore } from "@/features/notifications/stores/notifications.store";
import { useChatStore } from "@/features/chat/stores/chat.store";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

export const NotificationBell = ({
  scrolled = false,
}: {
  scrolled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useNotifications();
  const notifications = useNotificationsStore((s) => s.notifications);
  const unreadNotifCount = useNotificationsStore((s) => s.unreadCount);
  const unreadChatCount = useChatStore((s) => s.totalUnread);
  const totalUnread = unreadNotifCount + unreadChatCount;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        aria-expanded={open}
        className={`relative p-1 ${scrolled ? "text-primary-500" : "text-white/70"} hover:text-white transition-colors`}
      >
        <BellIcon className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-surface rounded-xl shadow-card overflow-hidden z-50">
          <div className="p-3 border-b border-primary-100 flex justify-between items-center">
            <h3 className="font-heading">Notifications</h3>
            <Link
              href="/notifications"
              className="text-sm text-accent"
              onClick={() => setOpen(false)}
            >
              Voir tout
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <p className="p-4 text-sm text-primary-400 text-center">
                Aucune notification
              </p>
            ) : (
              recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    setOpen(false);
                  }}
                  className={`p-3 hover:bg-primary-50 border-b cursor-pointer ${notif.status !== "read" ? "bg-accent/5" : ""}`}
                >
                  <p className="text-sm font-medium">{notif.content.title}</p>
                  <p className="text-xs text-primary-500">
                    {notif.content.body}
                  </p>
                  <p className="text-xs text-primary-400 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
