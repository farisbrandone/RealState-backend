// Exécuté avant l'hydratation React (voir la doc Next.js sur
// instrumentation-client.js). Sans NEXT_PUBLIC_SENTRY_DSN, le SDK reste inactif.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
