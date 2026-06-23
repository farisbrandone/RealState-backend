'use client';

import { Header } from '@/shared/ui/layout/Header/Header';
import { Footer } from '@/shared/ui/layout/Footer/Footer';
import { useWebSocket } from '@/features/chat/hooks/useWebSocket';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useSubscriptionGuard } from '@/features/auth/hooks/useSubscriptionGuard';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!useAuthStore(s => s.accessToken);
  useWebSocket(isAuthenticated);
  useSubscriptionGuard();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
