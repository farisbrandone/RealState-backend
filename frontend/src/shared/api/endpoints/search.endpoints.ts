import httpClient from '../clients/http.client';

export const searchApi = {
  search: (filters: any, page = 1, limit = 20) =>
    httpClient.get('/search', { params: { ...filters, page, limit } }),
  autocomplete: (q: string) => httpClient.get('/search/autocomplete', { params: { q } }),
  nearby: (lat: number, lon: number, radius: number, filters?: any) =>
    httpClient.get('/geo/nearby', { params: { lat, lon, radius, ...filters } }),
  suggestions: (q: string) => httpClient.get('/suggestions/locations', { params: { q } }),
};
