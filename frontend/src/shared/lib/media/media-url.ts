const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3002/api/v1";

// Les fichiers uploadés (/uploads/...) sont servis à la racine du serveur
// backend, en dehors du préfixe /api/v1 des routes API — on ne peut donc pas
// réutiliser NEXT_PUBLIC_API_GATEWAY_URL tel quel pour construire une URL média.
const MEDIA_BASE_URL = API_GATEWAY_URL.replace(/\/api\/v\d+\/?$/, "");

/**
 * Construit l'URL absolue d'un média retourné par l'API (ex: "/uploads/x.png").
 * Retourne l'URL telle quelle si elle est déjà absolue (Cloudinary/Firebase),
 * et null si aucun chemin n'est fourni — à charge de l'appelant d'afficher
 * un état de repli plutôt qu'une image cassée.
 */
export function getMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${MEDIA_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
