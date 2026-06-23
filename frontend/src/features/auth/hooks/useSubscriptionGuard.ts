'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../stores/auth.store';

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/pricing',
  '/checkout',
];

export const useSubscriptionGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore(s => s.user);
  const isAuthenticated = !!useAuthStore(s => s.accessToken);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
    if (isPublic) return;

    const subscription = user.subscription;
    if (!subscription) return; // pas d'info, on laisse passer (ou on redirige ?)

    const now = new Date();
    const trialEnd = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
    const periodEnd = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd)
      : null;

    const hasActiveSubscription =
      subscription.status === 'active' || subscription.status === 'trialing';

    // Si l'essai est terminé ET pas d'abonnement actif, rediriger vers pricing
    if (
      (!hasActiveSubscription && trialEnd && now > trialEnd) ||
      subscription.status === 'expired' ||
      subscription.status === 'canceled'
    ) {
      router.push('/pricing');
    }
  }, [isAuthenticated, user, pathname, router]);
};
