// src/app/(main)/profile/settings/notifications/page.tsx
'use client';

import { useNotificationPreferences } from '@/features/notifications/hooks/useNotificationPreferences';
import { Button } from '@/shared/ui/components/Button/Button';

export default function NotificationSettingsPage() {
  const { preferences, isLoading, updatePreferences } = useNotificationPreferences();
  // Interface pour modifier les canaux et types
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-heading mb-6">Préférences de notifications</h1>
      {/* Afficher et modifier */}
    </div>
  );
}
