import { ReactNode } from 'react';
import { Providers } from '@/shared/providers';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'LuxHorizon - Immobilier de prestige',
  description: "Trouvez votre bien d'exception",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
