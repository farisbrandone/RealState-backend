'use client';

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { removeAccessTokenCookie } from '@/shared/lib/storage/token.storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);

  // localStorage (source de vérité côté client, via Zustand) est scopé par
  // origine — port inclus — contrairement au cookie que lit le middleware,
  // qui ne l'est pas. En changeant de port en dev (ou après un nettoyage
  // partiel du storage), un cookie d'une session précédente peut rester
  // présent alors que l'état client, lui, est bien "déconnecté" — le
  // middleware croit alors l'utilisateur connecté et le renvoie en boucle
  // depuis /login vers l'accueil. On réconcilie au montage : si le client
  // n'a pas de session, aucun cookie ne doit traîner.
  useEffect(() => {
    if (!accessToken) removeAccessTokenCookie();
  }, [accessToken]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
