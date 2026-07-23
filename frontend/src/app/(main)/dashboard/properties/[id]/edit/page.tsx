"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { propertyManagementApi } from "@/shared/api/endpoints/property-management.endpoints";
import { PropertyForm } from "@/widgets/PropertyForm/PropertyForm";
import { useUpdateProperty } from "@/features/property-management/hooks/useUpdateProperty";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import toast from "react-hot-toast";

export default function EditPropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const router = useRouter();
  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertyManagementApi.getById(propertyId),
    enabled: !!propertyId,
  });

  const updateMutation = useUpdateProperty(propertyId);

  const handleSubmit = async (data: any) => {
    const { files, removedMediaIds, ...propertyData } = data;

    try {
      // 1. Mettre à jour les données (titre, description, etc.) + supprimer les médias demandés
      await propertyManagementApi.update(propertyId, {
        ...propertyData,
        removedMediaIds, // envoie la liste des médias à supprimer
      });

      // 2. Uploader les nouveaux fichiers un par un
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const isMain =
            i === 0 &&
            property &&
            (!property.data?.media || property.data.media.length === 0);
          await propertyManagementApi.uploadMedia(propertyId, files[i], isMain);
        }
      }

      toast.success("Propriété mise à jour avec succès !");
      router.push("/dashboard/properties");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la mise à jour",
      );
    }
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!property) return <p className="text-red-500">Propriété introuvable</p>;

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Modifier le bien</h1>
      <PropertyForm
        defaultValues={property.data}
        existingMediaParent={property.data?.media || []} // ⬅️ ajout
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Mettre à jour"
      />
    </div>
  );
}
