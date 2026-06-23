'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyFormSchema } from './schema'; // Nous devons créer ce schéma
import { PropertyFormValues } from '@/features/property-management/types';
import { Input } from '@/shared/ui/components/Input/Input';
import { Button } from '@/shared/ui/components/Button/Button';
import { Card } from '@/shared/ui/components/Card/Card';
import { useState } from 'react';

interface PropertyFormProps {
  defaultValues?: Partial<PropertyFormValues>;
  onSubmit: (data: PropertyFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

// Pour simplifier, nous n'implémenterons pas le schéma Zod complet ici, mais un squelette.
// Nous supposerons l'existence d'un schéma (que nous pouvons créer vite fait).

export const PropertyForm: React.FC<PropertyFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Enregistrer',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    defaultValues,
    // resolver: zodResolver(propertyFormSchema), // décommenter après avoir créé le schéma
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Informations générales */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Titre" {...register('title')} error={errors.title?.message} />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full rounded-md border border-primary-200 p-3 focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </Card>

      {/* Adresse */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Rue" {...register('address.street')} />
          <Input label="Ville" {...register('address.city')} />
          <Input label="Code postal" {...register('address.postalCode')} />
          <Input label="Pays" {...register('address.country')} />
        </div>
      </Card>

      {/* Caractéristiques (partiel, nous pouvons étendre) */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Caractéristiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Pièces"
            type="number"
            {...register('features.rooms', { valueAsNumber: true })}
          />
          <Input
            label="Chambres"
            type="number"
            {...register('features.bedrooms', { valueAsNumber: true })}
          />
          <Input
            label="Salles de bain"
            type="number"
            {...register('features.bathrooms', { valueAsNumber: true })}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Surface habitable</label>
            <div className="flex gap-2">
              <Input
                placeholder="Valeur"
                type="number"
                {...register('features.livingArea.value', { valueAsNumber: true })}
              />
              <select
                className="rounded-md border border-primary-200 p-2"
                {...register('features.livingArea.unit')}
              >
                <option value="m²">m²</option>
                <option value="ft²">ft²</option>
              </select>
            </div>
          </div>
          {/* etc. */}
        </div>
      </Card>

      {/* Prix et transaction */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Prix et transaction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="rounded-md border border-primary-200 p-2"
            {...register('listing.type')}
          >
            <option value="sale">Vente</option>
            <option value="rent">Location</option>
          </select>
          <Input
            label="Prix"
            type="number"
            {...register('listing.price.amount', { valueAsNumber: true })}
          />
          <Input label="Devise" {...register('listing.price.currency')} defaultValue="EUR" />
        </div>
      </Card>

      <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : submitLabel}
      </Button>
    </form>
  );
};
