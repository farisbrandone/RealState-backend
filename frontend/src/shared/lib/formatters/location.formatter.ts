interface LocationParts {
  neighborhood?: string | null;
  city?: string | null;
  country?: string | null;
}

// Quartier, Ville, Pays — dans cet ordre, en ignorant les parties absentes.
// Centralisé ici pour que le quartier apparaisse partout où une localisation
// est affichée (fiche bien, cartes de résultats, popup carte...), pas
// seulement sur certaines pages.
export function formatLocation({ neighborhood, city, country }: LocationParts): string {
  const parts = [neighborhood, city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Localisation inconnue';
}
