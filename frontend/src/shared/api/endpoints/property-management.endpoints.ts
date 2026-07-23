import httpClient from '../clients/http.client';

export interface OwnerStats {
  totalProperties: number;
  publishedProperties: number;
  totalViews: number;
  totalInquiries: number;
}

export const propertyManagementApi = {
  listMyProperties: (params?: any) => httpClient.get('/properties', { params }),
  getById: (id: string) => httpClient.get(`/properties/${id}`),
  myStats: () => httpClient.get<OwnerStats>('/properties/mine/stats'),
  create: (data: any) => httpClient.post('/properties', data),
  update: (id: string, data: any) => httpClient.put(`/properties/${id}`, data),
  delete: (id: string) => httpClient.delete(`/properties/${id}`),
  publish: (id: string) => httpClient.post(`/properties/${id}/publish`),
  unpublish: (id: string) => httpClient.post(`/properties/${id}/unpublish`),
  uploadMedia: (propertyId: string, file: File, isMain = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isMain', String(isMain));
    return httpClient.post(`/properties/${propertyId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteMedia: (propertyId: string, mediaId: string) =>
    httpClient.delete(`/properties/${propertyId}/media/${mediaId}`),
};
