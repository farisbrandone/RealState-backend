import httpClient from "../clients/http.client";

export const userApi = {
  getProfile: (userId: string) => httpClient.get(`/users/${userId}/profile`),
  updateProfile: (userId: string, data: any) =>
    httpClient.put(`/users/${userId}/profile`, data),
  uploadAvatar: (userId: string, formData: FormData) =>
    httpClient.post(`/users/${userId}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  upgradeToAgent: (userId: string) =>
    httpClient.post(`/users/${userId}/upgrade-agent`),
};
