import { useFavoritesStore } from './favorites.store';
import { PropertySearchResult } from '@/features/property-search/types';

function buildProperty(id: string): PropertySearchResult {
  return {
    id,
    title: `Bien ${id}`,
    description: '',
    price: 50_000_000,
    currency: 'XAF',
    propertyType: 'villa',
    location: {
      address: '',
      city: 'Douala',
      postalCode: '',
      country: 'Cameroun',
      geoPoint: { lat: 0, lon: 0 },
    },
    features: { bedrooms: 3, bathrooms: 2, squareMeters: 120 },
  } as unknown as PropertySearchResult;
}

describe('useFavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] });
  });

  it('commence sans favoris', () => {
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
  });

  it('toggleFavorite ajoute un bien absent des favoris', () => {
    const property = buildProperty('prop-1');
    useFavoritesStore.getState().toggleFavorite(property);

    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
    expect(useFavoritesStore.getState().isFavorite('prop-1')).toBe(true);
  });

  it('toggleFavorite retire un bien déjà favori (bascule)', () => {
    const property = buildProperty('prop-1');
    useFavoritesStore.getState().toggleFavorite(property);
    useFavoritesStore.getState().toggleFavorite(property);

    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
    expect(useFavoritesStore.getState().isFavorite('prop-1')).toBe(false);
  });

  it('removeFavorite retire un bien par id', () => {
    useFavoritesStore.getState().toggleFavorite(buildProperty('prop-1'));
    useFavoritesStore.getState().toggleFavorite(buildProperty('prop-2'));

    useFavoritesStore.getState().removeFavorite('prop-1');

    const ids = useFavoritesStore.getState().favorites.map((f) => f.id);
    expect(ids).toEqual(['prop-2']);
  });

  it('isFavorite renvoie false pour un id inconnu', () => {
    expect(useFavoritesStore.getState().isFavorite('inconnu')).toBe(false);
  });
});
