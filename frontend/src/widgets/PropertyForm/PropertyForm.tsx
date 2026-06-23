"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/shared/ui/components/Input/Input";
import { Button } from "@/shared/ui/components/Button/Button";
import { Card } from "@/shared/ui/components/Card/Card";
import { PROPERTY_TYPES } from "@/shared/constants/property.constants";

interface PropertyFormValues {
  title: string;
  description: string;
  propertyType: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  features: {
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    livingArea: { value: number; unit: string };
    isFurnished: boolean;
  };
  listing: {
    type: "sale" | "rent";
    price: { amount: number; currency: string };
  };
}

interface PropertyFormProps {
  defaultValues?: any;
  onSubmit: (data: PropertyFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      propertyType: defaultValues?.propertyType || "",
      address: {
        street: defaultValues?.address?.street || "",
        city: defaultValues?.address?.city || "",
        postalCode: defaultValues?.address?.postalCode || "",
        country: defaultValues?.address?.country || "",
      },
      features: {
        rooms: defaultValues?.features?.rooms || 1,
        bedrooms: defaultValues?.features?.bedrooms || 1,
        bathrooms: defaultValues?.features?.bathrooms || 1,
        livingArea: {
          value: defaultValues?.features?.livingArea?.value || 0,
          unit: defaultValues?.features?.livingArea?.unit || "m²",
        },
        isFurnished: defaultValues?.features?.isFurnished || false,
      },
      listing: {
        type: defaultValues?.listing?.type || "sale",
        price: {
          amount: defaultValues?.listing?.price?.amount || 0,
          currency: defaultValues?.listing?.price?.currency || "XAF",
        },
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* Informations générales */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Titre"
              {...register("title", { required: true })}
              error={errors.title?.message}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows={5}
              className="w-full rounded-lg border border-primary-200 p-3 focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Type de bien
            </label>
            <select
              {...register("propertyType", { required: true })}
              className="w-full rounded-lg border border-primary-200 p-3"
            >
              <option value="">Sélectionner</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Type de transaction
            </label>
            <select
              {...register("listing.type")}
              className="w-full rounded-lg border border-primary-200 p-3"
            >
              <option value="sale">À vendre</option>
              <option value="rent">À louer</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Adresse */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Rue" {...register("address.street")} />
          <Input label="Ville" {...register("address.city")} />
          <Input label="Code postal" {...register("address.postalCode")} />
          <Input label="Pays" {...register("address.country")} />
        </div>
      </Card>

      {/* Caractéristiques */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Caractéristiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Pièces"
            type="number"
            {...register("features.rooms", { valueAsNumber: true })}
          />
          <Input
            label="Chambres"
            type="number"
            {...register("features.bedrooms", { valueAsNumber: true })}
          />
          <Input
            label="Salles de bain"
            type="number"
            {...register("features.bathrooms", { valueAsNumber: true })}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Surface</label>
            <div className="flex gap-2">
              <input
                type="number"
                {...register("features.livingArea.value", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-lg border border-primary-200 p-2"
                placeholder="Valeur"
              />
              <select
                {...register("features.livingArea.unit")}
                className="rounded-lg border border-primary-200 p-2"
              >
                <option value="m²">m²</option>
                <option value="ft²">ft²</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              {...register("features.isFurnished")}
              className="rounded border-primary-300 text-accent"
            />
            <label className="text-sm">Meublé</label>
          </div>
        </div>
      </Card>

      {/* Prix */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Prix</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Montant"
            type="number"
            {...register("listing.price.amount", { valueAsNumber: true })}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Devise</label>
            <select
              {...register("listing.price.currency")}
              className="w-full rounded-lg border border-primary-200 p-3"
            >
              <option value="XAF">FCFA</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </Card>

      <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : submitLabel}
      </Button>
    </form>
  );
};
