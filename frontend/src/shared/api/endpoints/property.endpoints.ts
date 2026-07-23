import httpClient from "../clients/http.client";

export const propertyApi = {
  getById: (id: string) => httpClient.get(`/properties/${id}`),
  search: (filters: any) => httpClient.get("/search", { params: filters }),
  reindex: () => httpClient.post("/properties/reindex"),
};
