"use client";

import { PropertyForm } from "@/widgets/PropertyForm/PropertyForm";
import { useCreateProperty } from "@/features/property-management/hooks/useCreateProperty";
import { propertyManagementApi } from "@/shared/api/endpoints/property-management.endpoints";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function NewPropertyPage() {
  const createMutation = useCreateProperty();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const { files, ...propertyData } = data;

    try {
      // 1. Créer la propriété

      const response = await createMutation.mutateAsync(propertyData);
      const propertyId = response.data.id; // Le backend doit renvoyer l'ID de la propriété créée

      // 2. Uploader les fichiers un par un
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const isMain = i === 0; // La première image est principale

          const result = await propertyManagementApi.uploadMedia(
            propertyId,
            files[i],
            isMain,
          );
          console.log({ titi: result.data });
        }
      }

      toast.success("Propriété créée avec succès !");
      //router.push("/dashboard/properties");
    } catch (error: any) {
      console.log(error.response?.data?.message);
      toast.error(
        error.response?.data?.message || "Erreur lors de la création",
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Nouveau bien</h1>
      <PropertyForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Créer le bien"
      />
    </div>
  );
}
