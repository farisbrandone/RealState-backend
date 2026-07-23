"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyManagementApi } from "@/shared/api/endpoints/property-management.endpoints";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: any) => propertyManagementApi.create(data),
    onSuccess: (res) => {
      toast.success("Propriété créée avec succès");
      queryClient.invalidateQueries({ queryKey: ["myProperties"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création",
      );
    },
  });
};
