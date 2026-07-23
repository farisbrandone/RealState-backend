'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h1>Une erreur critique est survenue</h1>
            <p>Nous avons été notifiés et travaillons à la résoudre.</p>
            <button type="button" onClick={reset}>
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
