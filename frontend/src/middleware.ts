import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Liste des pages publiques préfixées
const publicPrefixes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Récupération du token
  const token = request.cookies.get("accessToken")?.value;

  // Strictement public si c'est la racine exacte OU si ça commence par un des préfixes publics
  const isPublic =
    pathname === "/" ||
    publicPrefixes.some((path) => pathname.startsWith(path));

  // 1. Cas : Utilisateur NON connecté qui tente d'accéder à une page PRIVÉE
  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Cas : Utilisateur CONNECTÉ qui tente d'accéder à une page PUBLIQUE (Ex: /login, /register, ou /)
  // Attention : On exclut le processus de vérification d'email pour ne pas bloquer l'utilisateur
  if (isPublic && token && !pathname.startsWith("/verify-email")) {
    // Si l'utilisateur connecté est déjà sur la racine "/", on le laisse tranquille (NextResponse.next())
    // Sinon, s'il essaie d'aller sur /login ou /register, on le renvoie vers le dashboard (ou l'accueil sécurisé)
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
