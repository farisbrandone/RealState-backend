import httpClient from '../clients/http.client';

export const userApi = {
  getProfile: (userId: string) => httpClient.get(`/users/${userId}/profile`),
  updateProfile: (userId: string, data: any) => httpClient.put(`/users/${userId}/profile`, data),
};
