"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ChartBarIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { label: "Vue d’ensemble", href: "/dashboard", icon: HomeIcon },
  {
    label: "Mes propriétés",
    href: "/dashboard/properties",
    icon: BuildingOfficeIcon,
  },
  { label: "Profil", href: "/dashboard/profile", icon: UserCircleIcon },
  {
    label: "Sécurité",
    href: "/dashboard/profile/security",
    icon: ShieldCheckIcon,
  },
  { label: "Paiements", href: "/dashboard/payments", icon: CreditCardIcon },
  {
    label: "Abonnements",
    href: "/dashboard/payments/subscriptions",
    icon: CreditCardIcon,
  },
  { label: "Statistiques", href: "/dashboard/analytics", icon: ChartBarIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar desktop — bg-ink reste toujours sombre (voir globals.css),
          donc le texte clair reste lisible en clair comme en sombre. */}
      <aside className="hidden w-64 shrink-0 bg-ink text-white lg:block">
        <div className="p-6">
          <h2 className="text-xl font-heading text-accent mb-8">Dashboard</h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-ink-elevated text-white font-medium"
                      : "text-white/70 hover:bg-ink-elevated hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Navigation mobile/tablette — la sidebar est masquée sous lg, il faut
          donc un accès équivalent : bandeau d'onglets horizontal scrollable,
          collant sous le header principal. Sans ça, Profil/Sécurité/
          Paiements/Abonnements/Statistiques sont inatteignables sur mobile. */}
      <nav
        aria-label="Navigation du tableau de bord"
        className="sticky top-16 z-30 flex gap-1 overflow-x-auto border-b border-primary-100 bg-surface px-3 py-2 lg:hidden"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-primary-600 hover:bg-primary-50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Contenu principal */}
      <main className="flex-1 bg-background p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
