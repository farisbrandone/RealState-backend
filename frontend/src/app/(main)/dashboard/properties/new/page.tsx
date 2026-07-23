"use client";

import { useState } from "react";
import { PropertyForm } from "@/widgets/PropertyForm/PropertyForm";
import { useCreateProperty } from "@/features/property-management/hooks/useCreateProperty";
import { propertyManagementApi } from "@/shared/api/endpoints/property-management.endpoints";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function NewPropertyPage() {
  const createMutation = useCreateProperty();
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);

  const handleSubmit = async (data: any) => {
    const { files, mainFileIndex, removedMediaIds, ...propertyData } = data;

    try {
      const response = await createMutation.mutateAsync(propertyData);
      const propertyId = response.data.id;

      if (files && files.length > 0) {
        setUploadProgress({ done: 0, total: files.length });

        // Upload en parallèle (plus rapide) tout en gardant la progression visible
        await Promise.all(
          files.map(async (file: File, i: number) => {
            try {
              await propertyManagementApi.uploadMedia(
                propertyId,
                file,
                i === mainFileIndex,
              );
            } finally {
              setUploadProgress((prev) =>
                prev ? { ...prev, done: prev.done + 1 } : prev,
              );
            }
          }),
        );
      }

      toast.success("Propriété créée avec succès !");
      router.push("/dashboard/properties");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création",
      );
    } finally {
      setUploadProgress(null);
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl">Nouveau bien</h1>

      <PropertyForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || !!uploadProgress}
        submitLabel="Créer le bien"
      />

      {uploadProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 max-w-[90vw] rounded-2xl bg-surface p-6 shadow-2xl">
            <p className="mb-3 text-center font-heading text-primary-900">
              Envoi des photos ({uploadProgress.done}/{uploadProgress.total})
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-primary-100">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{
                  width: `${(uploadProgress.done / uploadProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
