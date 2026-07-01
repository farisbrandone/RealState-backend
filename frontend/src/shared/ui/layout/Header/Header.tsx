"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/shared/ui/components/Logo/Logo";
import { NotificationBell } from "@/widgets/NotificationBell/NotificationBell";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useChatStore } from "@/features/chat/stores/chat.store";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BuildingStorefrontIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = !!user;
  const totalUnread = useChatStore((s) => s.totalUnread);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handlePostProperty = () => {
    if (!user) {
      // Non connecté → rediriger vers login avec redirect
      router.push("/login?redirect=/dashboard/properties/new");
      return;
    }
    if (
      user.roles.includes("USER") &&
      !user.roles.includes("AGENT") &&
      !user.roles.includes("OWNER")
    ) {
      // Utilisateur simple → rediriger vers la page de profil pour devenir agent
      router.push(
        "/dashboard/profile?upgrade=agent&redirect=/dashboard/properties/new",
      );
      return;
    }
    // Agent ou propriétaire → directement vers la création d'offre
    router.push("/dashboard/properties/new");
  };

  // Effet de scroll pour le header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu utilisateur au clic extérieur
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-primary-100"
            : "bg-primary-900/95 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <BuildingStorefrontIcon className="h-5 w-5 text-primary-900" />
              </div>
              <span
                className={`text-xl font-heading font-bold ${scrolled ? "text-primary-900" : "text-white"}`}
              >
                LuxHorizon
              </span>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: "/", label: "Accueil", icon: HomeIcon },
                {
                  href: "/search?transactionType=sale",
                  label: "Acheter",
                  icon: MagnifyingGlassIcon,
                },
                {
                  href: "/search?transactionType=rent",
                  label: "Louer",
                  icon: BuildingOfficeIcon,
                },
                { href: "/agents", label: "Agents", icon: UserGroupIcon },
                {
                  href: "/agencies",
                  label: "Agences",
                  icon: BuildingStorefrontIcon,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    scrolled
                      ? "text-primary-600 hover:text-accent hover:bg-primary-50"
                      : "text-primary-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions droite */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePostProperty}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  scrolled
                    ? "bg-accent text-white hover:bg-accent-dark"
                    : "bg-accent text-primary-900 hover:bg-accent-light"
                }`}
              >
                <PlusIcon className="h-4 w-4" />
                Poster une annonce
              </button>
              {/* Bouton estimation */}
              <Link
                href="/estimate"
                className={`hidden sm:flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  scrolled
                    ? "bg-accent text-white hover:bg-accent-dark"
                    : "bg-accent text-primary-900 hover:bg-accent-light"
                }`}
              >
                Estimation gratuite
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Messages */}
                  <Link
                    href="/messages"
                    className={`relative p-2 rounded-lg transition-colors ${
                      scrolled
                        ? "text-primary-500 hover:bg-primary-50"
                        : "text-primary-200 hover:bg-white/10"
                    }`}
                    title="Messages"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    {totalUnread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {totalUnread > 9 ? "9+" : totalUnread}
                      </span>
                    )}
                  </Link>

                  {/* Notifications */}
                  <NotificationBell scrolled={scrolled} />

                  {/* Avatar / Menu utilisateur */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <img
                        src={
                          "http://localhost:3002" + user?.avatar ||
                          "/images/avatar-placeholder.png"
                        }
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border-2 border-accent"
                      />
                      <span
                        className={`hidden md:block text-sm font-medium ${scrolled ? "text-primary-700" : "text-white"}`}
                      >
                        {user?.firstName}
                      </span>
                      <ChevronDownIcon
                        className={`h-4 w-4 ${scrolled ? "text-primary-400" : "text-primary-300"}`}
                      />
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-card border border-primary-100 overflow-hidden z-50 animate-fade-in">
                        <div className="p-3 border-b border-primary-100">
                          <p className="font-medium text-primary-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-primary-400">
                            {user?.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50"
                          >
                            <Cog6ToothIcon className="h-4 w-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50"
                          >
                            <UserCircleIcon className="h-4 w-4" />
                            Mon profil
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      scrolled
                        ? "text-primary-600 hover:bg-primary-50"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="bg-accent text-primary-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light transition-all"
                  >
                    Inscription
                  </Link>
                </div>
              )}

              {/* Burger mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-primary-200 hover:bg-white/10"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-primary-100 animate-slide-in-down">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/search?transactionType=sale"
                className="block px-3 py-2 rounded-lg text-primary-700 hover:bg-primary-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏠 Acheter
              </Link>
              <Link
                href="/search?transactionType=rent"
                className="block px-3 py-2 rounded-lg text-primary-700 hover:bg-primary-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                🔑 Louer
              </Link>
              <Link
                href="/agents"
                className="block px-3 py-2 rounded-lg text-primary-700 hover:bg-primary-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                👥 Agents
              </Link>
              <Link
                href="/agencies"
                className="block px-3 py-2 rounded-lg text-primary-700 hover:bg-primary-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏢 Agences
              </Link>
              <Link
                href="/estimate"
                className="block px-3 py-2 rounded-lg text-primary-700 hover:bg-primary-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                💰 Estimation
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Espaceur pour le header fixe */}
      <div className="h-16" />
    </>
  );
};
