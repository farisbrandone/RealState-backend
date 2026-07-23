"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertsApi, CreateSavedSearchPayload } from "@/shared/api/endpoints/alerts.endpoints";
import { toast } from "react-hot-toast";

const QUERY_KEY = ["saved-searches"];

export function useSavedSearches() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => (await alertsApi.list()).data,
  });
}

export function useCreateSavedSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSavedSearchPayload) => alertsApi.create(data),
    onSuccess: () => {
      toast.success("Alerte créée — vous serez notifié dès qu'un bien correspond.");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la création de l'alerte");
    },
  });
}

export function useToggleSavedSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? alertsApi.activate(id) : alertsApi.deactivate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteSavedSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsApi.remove(id),
    onSuccess: () => {
      toast.success("Alerte supprimée");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
