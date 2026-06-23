"use client";

import { PropertyForm } from "@/widgets/PropertyForm/PropertyForm";
import { useCreateProperty } from "@/features/property-management/hooks/useCreateProperty";

export default function NewPropertyPage() {
  const createMutation = useCreateProperty();

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Nouveau bien</h1>
      <PropertyForm
        onSubmit={(data) => createMutation.mutate(data)}
        isSubmitting={createMutation.isPending}
        submitLabel="Créer le bien"
      />
    </div>
  );
}
