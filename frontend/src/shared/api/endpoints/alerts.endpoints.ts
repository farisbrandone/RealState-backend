import httpClient from '../clients/http.client';

export interface SavedSearchCriteria {
  transactionType?: 'sale' | 'rent';
  propertyType?: string[];
  city?: string;
  priceMin?: number;
  priceMax?: number;
  bedroomsMin?: number;
}

export interface CreateSavedSearchPayload extends SavedSearchCriteria {
  name: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  criteria: SavedSearchCriteria;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastNotifiedAt: string | null;
}

export const alertsApi = {
  list: () => httpClient.get<SavedSearch[]>('/saved-searches'),
  create: (data: CreateSavedSearchPayload) => httpClient.post<SavedSearch>('/saved-searches', data),
  activate: (id: string) => httpClient.patch<SavedSearch>(`/saved-searches/${id}/activate`),
  deactivate: (id: string) => httpClient.patch<SavedSearch>(`/saved-searches/${id}/deactivate`),
  remove: (id: string) => httpClient.delete(`/saved-searches/${id}`),
};
