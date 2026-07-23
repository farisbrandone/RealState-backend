import { getMediaUrl } from './media-url';

describe('getMediaUrl', () => {
  it('retourne null si aucun chemin n’est fourni', () => {
    expect(getMediaUrl(undefined)).toBeNull();
    expect(getMediaUrl(null)).toBeNull();
    expect(getMediaUrl('')).toBeNull();
  });

  it('retourne l’URL telle quelle si elle est déjà absolue (Cloudinary/Firebase)', () => {
    expect(getMediaUrl('https://res.cloudinary.com/x/y.jpg')).toBe(
      'https://res.cloudinary.com/x/y.jpg',
    );
    expect(getMediaUrl('http://example.com/a.png')).toBe('http://example.com/a.png');
  });

  it('préfixe un chemin relatif avec la base média (sans le suffixe /api/v1)', () => {
    const result = getMediaUrl('/uploads/properties/x/y.jpg');
    expect(result).not.toBeNull();
    expect(result).not.toContain('/api/v1');
    expect(result?.endsWith('/uploads/properties/x/y.jpg')).toBe(true);
  });

  it('ajoute le slash manquant si le chemin n’en a pas', () => {
    const result = getMediaUrl('uploads/avatars/z.png');
    expect(result?.endsWith('/uploads/avatars/z.png')).toBe(true);
  });
});
