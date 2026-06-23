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
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="w-64 bg-primary-800 text-white flex-shrink-0 hidden lg:block">
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
                      ? "bg-primary-700 text-white font-medium"
                      : "text-primary-200 hover:bg-primary-700 hover:text-white"
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

      {/* Contenu principal */}
      <main className="flex-1 bg-background p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
