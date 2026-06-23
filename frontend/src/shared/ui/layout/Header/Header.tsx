'use client';

import Link from 'next/link';
import { Logo } from '@/shared/ui/components/Logo/Logo';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { NotificationBell } from '@/widgets/NotificationBell/NotificationBell';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useState } from 'react';

export const Header = () => {
  const user = useAuthStore(s => s.user);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary-900 text-white shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <Link href="/" className="flex-shrink-0">
            <Logo className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex space-x-8 ml-10">
            <Link
              href="/search?transactionType=sale"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              Acheter
            </Link>
            <Link
              href="/search?transactionType=rent"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              Louer
            </Link>
            <Link
              href="/agents"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              Agents
            </Link>
            {user && (
              <Link
                href="/messages"
                className="text-sm font-medium hover:text-accent transition-colors"
              >
                Messages
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Link
              href={user ? '/profile' : '/login'}
              className="p-1 text-primary-200 hover:text-white"
            >
              <UserCircleIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
