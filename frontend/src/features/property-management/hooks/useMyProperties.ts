import { useQuery } from "@tanstack/react-query";
import { propertyManagementApi } from "@/shared/api/endpoints/property-management.endpoints";

interface MyPropertiesResponse {
  items: any[];
  total: number;
  page: number;
  limit: number;
}

export const useMyProperties = (ownerId: string, page = 1, limit = 10) => {
  return useQuery<MyPropertiesResponse>({
    queryKey: ["myProperties", ownerId, page],
    queryFn: async () => {
      const { data } = await propertyManagementApi.listMyProperties({
        ownerId,
        page,
        limit,
      });
      return data; // le backend renvoie { items, total, page, limit }
    },
    enabled: !!ownerId,
  });
};
