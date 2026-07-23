'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-heading text-red-500 mb-4">Oups</h1>
        <h2 className="text-2xl font-heading mb-6">Une erreur est survenue</h2>
        <p className="text-primary-500 mb-8">{error.message}</p>
        <button
          onClick={reset}
          className="bg-accent text-ink px-6 py-3 rounded-lg hover:bg-accent-dark"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
