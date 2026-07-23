import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages d'authentification : un visiteur déjà connecté en est redirigé.
const guestOnlyPrefixes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Pages de contenu/marketing ouvertes à tous (visiteurs anonymes inclus) —
// indispensable pour l'indexation SEO et la découverte avant inscription.
// "/properties" (racine, sans id) est volontairement EXCLU : c'est le panneau
// d'administration des annonces, pas une page publique.
const publicContentPrefixes = [
  "/search",
  "/agents",
  "/agencies",
  "/blog",
  "/estimate",
  "/contact",
  "/pricing",
  "/legal",
  "/rent",
  "/buy",
  "/invest",
  "/properties/",
  "/verify-email",
];

function decodePayload(token: string): { roles?: string[]; exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Un cookie présent ne veut pas dire un token valide : le cookie (max-age
// 15 min, aligné sur le token, voir token.storage.ts) peut malgré tout
// survivre à un ancien token si le navigateur en a gardé un plus vieux, ou
// si son horloge dérive. On vérifie donc aussi l'expiration réelle du JWT
// plutôt que la simple présence du cookie — sans quoi le middleware pouvait
// croire un visiteur connecté indéfiniment et le renvoyer en boucle depuis
// /login vers l'accueil alors que sa session avait expiré.
function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const payload = decodePayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawToken = request.cookies.get("accessToken")?.value;
  const token = isValidToken(rawToken) ? rawToken : undefined;

  const isGuestOnly = guestOnlyPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isPublicContent =
    pathname === "/" ||
    publicContentPrefixes.some((prefix) => pathname.startsWith(prefix));

  // Utilisateur non connecté sur une page ni publique ni d'authentification.
  if (!isGuestOnly && !isPublicContent && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Utilisateur déjà connecté qui tente d'accéder à login/register/etc.
  if (isGuestOnly && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Panneau d'administration des annonces ("/properties" exact) : réservé
  // ADMIN/SUPER_ADMIN. Décodage non vérifié — confort UX uniquement, la
  // vérification qui compte reste RolesGuard côté API.
  if (pathname === "/properties" || pathname === "/properties/") {
    const roles = token ? (decodePayload(token)?.roles ?? []) : [];
    if (!roles.includes("admin") && !roles.includes("super_admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json).*)",
  ],
};
