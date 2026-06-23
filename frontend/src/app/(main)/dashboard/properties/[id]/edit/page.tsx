"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { propertyManagementApi } from "@/shared/api/endpoints/property-management.endpoints";
import { PropertyForm } from "@/widgets/PropertyForm/PropertyForm";
import { useUpdateProperty } from "@/features/property-management/hooks/useUpdateProperty";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";

export default function EditPropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertyManagementApi.getById(propertyId),
    enabled: !!propertyId,
  });

  const updateMutation = useUpdateProperty(propertyId);

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!property) return <p className="text-red-500">Propriété introuvable</p>;

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Modifier le bien</h1>
      <PropertyForm
        defaultValues={property.data}
        onSubmit={(formData) => updateMutation.mutate(formData)}
        isSubmitting={updateMutation.isPending}
        submitLabel="Mettre à jour"
      />
    </div>
  );
}
