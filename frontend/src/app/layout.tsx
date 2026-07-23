import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Script from 'next/script';
import { Providers } from '@/shared/providers';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { NO_FLASH_THEME_SCRIPT } from '@/features/theme/hooks/useTheme';
import { InstallPrompt } from '@/widgets/InstallPrompt/InstallPrompt';

// Auto-hébergées via next/font : pas de requête bloquante vers Google Fonts,
// pas de CLS, et le design system (tailwind.config.ts) les référence via
// leurs variables CSS plutôt qu'un nom de police jamais réellement chargé.
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LuxHorizon - Immobilier de prestige',
  description: "Trouvez votre bien d'exception",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LuxHorizon',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1220' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${playfairDisplay.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pose la classe .dark avant l'hydratation : évite le flash du
            mauvais thème au chargement (voir useTheme.ts). */}
        <Script id="no-flash-theme" strategy="beforeInteractive">
          {NO_FLASH_THEME_SCRIPT}
        </Script>
      </head>
      <body>
        <Providers>
          {children}
          <Toaster position="top-right" />
          <InstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
