'use client';

import { PropertyForm } from '@/widgets/PropertyForm/PropertyForm';
import { useCreateProperty } from '@/features/property-management/hooks/useCreateProperty';

export default function NewPropertyPage() {
  const createMutation = useCreateProperty();

  const handleSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Nouvelle propriété</h1>
      <PropertyForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Créer la propriété"
      />
    </div>
  );
}
