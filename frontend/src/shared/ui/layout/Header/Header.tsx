"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "@/shared/ui/components/Logo/Logo";
import { NotificationBell } from "@/widgets/NotificationBell/NotificationBell";
import { ThemeToggle } from "@/shared/ui/components/ThemeToggle/ThemeToggle";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useChatStore } from "@/features/chat/stores/chat.store";
import { getMediaUrl } from "@/shared/lib/media/media-url";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  PlusIcon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  BellIcon,
  HeartIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = !!user;
  const totalUnread = useChatStore((s) => s.totalUnread);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
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
    { href: "/agencies", label: "Agences", icon: BuildingStorefrontIcon },
    { href: "/blog", label: "Blog", icon: MagnifyingGlassIcon },
  ];

  const mobileNavItems = [
    { href: "/", label: "Accueil", icon: "🏠" },
    { href: "/search?transactionType=sale", label: "Acheter", icon: "🔍" },
    { href: "/search?transactionType=rent", label: "Louer", icon: "🔑" },
    { href: "/agents", label: "Agents", icon: "👥" },
    { href: "/agencies", label: "Agences", icon: "🏢" },
    { href: "/blog", label: "Blog", icon: "📝" },
    { href: "/estimate", label: "Estimation", icon: "💰" },
    { href: "/invest", label: "Investir", icon: "📈" },
  ];

  // Seuls les liens sans paramètres de requête peuvent être comparés en toute
  // fiabilité au pathname courant (Acheter/Louer partagent /search).
  const isActive = (href: string) => !href.includes("?") && pathname === href;

  // Effet de scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
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

  // Fermer les menus avec la touche Échap (accessibilité)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handlePostProperty = () => {
    setMobileMenuOpen(false);
    if (!user) {
      router.push("/login?redirect=/dashboard/properties/new");
      return;
    }
    if (
      user.roles.includes("USER") &&
      !user.roles.includes("AGENT") &&
      !user.roles.includes("OWNER")
    ) {
      router.push(
        "/dashboard/profile?upgrade=agent&redirect=/dashboard/properties/new",
      );
      return;
    }
    router.push("/dashboard/properties/new");
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  // bg-ink ne bascule jamais avec le thème (contrairement à bg-primary-900) :
  // le header non scrollé reste un bandeau sombre en clair comme en sombre,
  // donc le texte clair (text-white / text-white/70) posé dessus reste
  // toujours lisible — voir le commentaire sur le token `ink` dans globals.css.
  const textColor = scrolled ? "text-primary-700" : "text-white";
  const subtleColor = scrolled ? "text-primary-500" : "text-white/70";
  const hoverBg = scrolled ? "hover:bg-primary-50" : "hover:bg-white/10";
  const bgHeader = scrolled
    ? "bg-surface/90 backdrop-blur-xl shadow-sm border-b border-primary-100"
    : "bg-ink/95 backdrop-blur-md";
  const logoColor = scrolled ? "text-primary-900" : "text-white";

  // Avatar : évite d'afficher une URL cassée quand user?.avatar est vide/undefined
  const avatarSrc = !avatarError ? getMediaUrl(user?.avatar) : null;

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${bgHeader}`}
      >
        {/* Respecte l'encoche/safe-area iOS sans rien casser ailleurs */}
        <div style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
          <div className="mx-auto max-w-7xl px-3 sm:px-4">
            <div className="flex h-16 items-center justify-between gap-2">
              {/* Logo — jamais compressé, jamais coupé sur mobile */}
              <Link
                href="/"
                className="flex shrink-0 items-center gap-2 rounded-lg sm:gap-2.5"
                aria-label="LuxHorizon — Accueil"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent sm:h-9 sm:w-9">
                  <BuildingStorefrontIcon className="h-4 w-4 text-ink sm:h-5 sm:w-5" />
                </div>
                <span
                  className={`whitespace-nowrap font-heading text-lg font-bold leading-none tracking-tight sm:text-xl ${logoColor}`}
                >
                  LuxHorizon
                </span>
              </Link>

              {/* Navigation desktop */}
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        active ? "text-accent" : textColor
                      } ${hoverBg}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                      {active && (
                        <span className="absolute inset-x-3 -bottom-[calc(0.5rem+1px)] h-0.5 rounded-full bg-accent" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Actions droite — pas de shrink-0 ici : sur les très petits
                  écrans (320-374px), logo + bouton "+" texte + burger
                  dépassaient systématiquement du viewport (voir capture
                  utilisateur). Le CTA reste icône seule jusqu'à sm, le texte
                  n'apparaît qu'à partir de là où la place est garantie. */}
              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                {/* Bouton Poster une annonce (visible dès le mobile, icône seule) */}
                <button
                  type="button"
                  onClick={handlePostProperty}
                  aria-label="Poster une annonce"
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-accent px-2.5 py-2 text-xs font-medium text-ink transition-all hover:bg-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:px-4 md:text-sm"
                >
                  <PlusIcon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Poster une annonce</span>
                </button>

                {/* Estimation (desktop only) */}
                <Link
                  href="/estimate"
                  className={`hidden items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all md:flex ${textColor} ${hoverBg}`}
                >
                  Estimation
                </Link>

                {/* Investir (desktop only) */}
                <Link
                  href="/invest"
                  className={`hidden items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all lg:flex ${textColor} ${hoverBg}`}
                >
                  Investir
                </Link>

                {/* Thème clair/sombre */}
                <ThemeToggle className={`hidden md:flex ${hoverBg}`} iconClassName={subtleColor} />

                {isAuthenticated ? (
                  <>
                    {/* Messages - desktop */}
                    <Link
                      href="/messages"
                      className={`relative hidden rounded-lg p-2 transition-colors md:flex ${subtleColor} ${hoverBg}`}
                      title="Messages"
                      aria-label="Messages"
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      {totalUnread > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                          {totalUnread > 9 ? "9+" : totalUnread}
                        </span>
                      )}
                    </Link>

                    {/* Notifications - desktop */}
                    <div className="hidden md:block">
                      <NotificationBell scrolled={scrolled} />
                    </div>

                    {/* Avatar / Menu utilisateur */}
                    <div className="relative" ref={userMenuRef}>
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        aria-expanded={userMenuOpen}
                        aria-haspopup="true"
                      >
                        {avatarSrc ? (
                          <img
                            src={avatarSrc}
                            alt=""
                            className="h-8 w-8 rounded-full border-2 border-accent object-cover"
                            onError={() => setAvatarError(true)}
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent bg-primary-100">
                            <UserCircleIcon className="h-5 w-5 text-primary-500" />
                          </div>
                        )}
                        <span
                          className={`hidden text-sm font-medium lg:block ${textColor}`}
                        >
                          {user?.firstName}
                        </span>
                        <ChevronDownIcon
                          className={`hidden h-4 w-4 transition-transform lg:block ${subtleColor} ${userMenuOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Dropdown menu utilisateur */}
                      {userMenuOpen && (
                        <div className="animate-fade-in absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-primary-100 bg-surface shadow-card">

                          <div className="border-b border-primary-100 p-3">
                            <p className="truncate font-medium text-primary-900">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="truncate text-xs text-primary-400">
                              {user?.email}
                            </p>
                          </div>
                          <div className="py-1">
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50"
                            >
                              <Cog6ToothIcon className="h-4 w-4 text-primary-400" />
                              Dashboard
                            </Link>
                            <Link
                              href="/dashboard/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50"
                            >
                              <UserCircleIcon className="h-4 w-4 text-primary-400" />
                              Mon profil
                            </Link>
                            <Link
                              href="/favorites"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50"
                            >
                              <HeartIcon className="h-4 w-4 text-primary-400" />
                              Favoris
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
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
                  <div className="hidden items-center gap-2 md:flex">
                    <Link
                      href="/login"
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${textColor} ${hoverBg}`}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition-all hover:bg-accent-light"
                    >
                      Inscription
                    </Link>
                  </div>
                )}

                {/* Burger mobile */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`rounded-lg p-2 transition-colors lg:hidden ${subtleColor} ${hoverBg}`}
                  aria-label={
                    mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"
                  }
                  aria-expanded={mobileMenuOpen}
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
        </div>
      </header>

      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="animate-slide-in-down absolute bottom-0 left-0 right-0 top-16 overflow-y-auto bg-surface shadow-2xl">
            <div className="space-y-6 px-4 py-6">
              {/* Carte utilisateur en tête de menu (identité claire dès l'ouverture) */}
              {isAuthenticated && (
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-primary-50 p-3"
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-full border-2 border-accent object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-surface">
                      <UserCircleIcon className="h-6 w-6 text-primary-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-primary-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="truncate text-xs text-primary-400">
                      {user?.email}
                    </p>
                  </div>
                </Link>
              )}

              {/* Navigation mobile */}
              <div className="space-y-1">
                <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-primary-400">
                  Navigation
                </p>
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                      isActive(item.href)
                        ? "bg-accent/10 text-accent"
                        : "text-primary-700 hover:bg-primary-50"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Thème mobile */}
              <div className="flex items-center justify-between rounded-lg border-t border-primary-100 px-3 pt-4">
                <span className="text-sm font-medium text-primary-700">Thème</span>
                <ThemeToggle iconClassName="text-primary-600" className="hover:bg-primary-50" />
              </div>

              {/* Actions utilisateur mobile */}
              {isAuthenticated ? (
                <div className="space-y-1 border-t border-primary-100 pt-4">
                  <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-primary-400">
                    Mon compte
                  </p>
                  <Link
                    href="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-primary-700 hover:bg-primary-50"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 text-primary-400" />
                    <span className="font-medium">Messages</span>
                    {totalUnread > 0 && (
                      <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                        {totalUnread}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-primary-700 hover:bg-primary-50"
                  >
                    <BellIcon className="h-5 w-5 text-primary-400" />
                    <span className="font-medium">Notifications</span>
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-primary-700 hover:bg-primary-50"
                  >
                    <HeartIcon className="h-5 w-5 text-primary-400" />
                    <span className="font-medium">Favoris</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-primary-700 hover:bg-primary-50"
                  >
                    <ChartBarIcon className="h-5 w-5 text-primary-400" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-primary-700 hover:bg-primary-50"
                  >
                    <UserCircleIcon className="h-5 w-5 text-primary-400" />
                    <span className="font-medium">Mon profil</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-red-600 hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 border-t border-primary-100 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-lg border border-primary-200 px-4 py-3 text-center font-medium text-primary-700 hover:bg-primary-50"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-lg bg-accent px-4 py-3 text-center font-medium text-ink hover:bg-accent-light"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Espaceur pour compenser le header fixe */}
      <div className="h-16" />
    </>
  );
};

