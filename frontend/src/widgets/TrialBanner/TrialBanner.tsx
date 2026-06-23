'use client';

import { useAuthStore } from '@/features/auth/stores/auth.store';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

export const TrialBanner = () => {
  const user = useAuthStore(s => s.user);
  const subscription = user?.subscription;
  if (!subscription || subscription.status !== 'trialing') return null;

  const trialEndsAt = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
  if (!trialEndsAt) return null;

  return (
    <div className="bg-accent text-primary-900 text-center py-2 px-4 text-sm font-medium">
      Période d’essai : se termine{' '}
      {formatDistanceToNow(trialEndsAt, { addSuffix: true, locale: fr })}.
      <Link href="/pricing" className="underline ml-2">
        Choisir un abonnement
      </Link>
    </div>
  );
};
