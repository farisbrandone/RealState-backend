"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyManagementApi } from "@/shared/api/endpoints/property-management.endpoints";
import { Button } from "@/shared/ui/components/Button/Button";
import { Card } from "@/shared/ui/components/Card/Card";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function AdminPropertiesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminProperties"],
    queryFn: () => propertyManagementApi.listMyProperties({}), // réutilise l'API avec filtre admin
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyManagementApi.delete(id),
    onSuccess: () => {
      toast.success("Propriété supprimée");
      queryClient.invalidateQueries({ queryKey: ["adminProperties"] });
    },
    onError: () => toast.error("Erreur"),
  });

  const properties = data?.data?.items || [];

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">
        Gestion des propriétés (Admin)
      </h1>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="space-y-4">
          {properties.map((property: any) => (
            <Card
              key={property.id}
              padding="md"
              className="flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{property.title}</h3>
                <p className="text-sm text-primary-500">
                  {formatPrice(
                    property.listing?.price?.amount,
                    property.listing?.price?.currency,
                  )}{" "}
                  - {property.status}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteMutation.mutate(property.id)}
              >
                <TrashIcon className="h-4 w-4 text-red-500" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
