"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/ui/components/Input/Input";
import { Button } from "@/shared/ui/components/Button/Button";
import { Card } from "@/shared/ui/components/Card/Card";
import {
  PROPERTY_TYPES,
  AMENITIES,
  EXTRA_FEATURES,
} from "@/shared/constants/property.constants";
import { PhotoIcon, XCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PropertyMapSelector } from "@/widgets/PropertyMapSelector/PropertyMapSelector";
interface PropertyFormProps {
  defaultValues?: any;
  onSubmit: (data: any) => void; // data inclura 'files'
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
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      propertyType: defaultValues?.propertyType || "",
      transactionType: defaultValues?.listing?.type || "sale",
      price: defaultValues?.listing?.price?.amount || 0,
      currency: defaultValues?.listing?.price?.currency || "XAF",
      "address.street": defaultValues?.address?.street || "",
      "address.city": defaultValues?.address?.city || "",
      "address.postalCode": defaultValues?.address?.postalCode || "",
      "address.country": defaultValues?.address?.country || "",
      "features.rooms": defaultValues?.features?.rooms || 1,
      "features.bedrooms": defaultValues?.features?.bedrooms || 1,
      "features.bathrooms": defaultValues?.features?.bathrooms || 1,
      "features.livingArea": defaultValues?.features?.livingArea?.value || 0,
      "features.livingAreaUnit":
        defaultValues?.features?.livingArea?.unit || "m²",
      "features.landArea": defaultValues?.features?.landArea?.value || 0,
      "features.landAreaUnit": defaultValues?.features?.landArea?.unit || "m²",
      "features.floor": defaultValues?.features?.floor || 0,
      "features.totalFloors": defaultValues?.features?.totalFloors || 0,
      "features.yearBuilt": defaultValues?.features?.yearBuilt || "",
      "features.energyClass": defaultValues?.features?.energyClass || "",
      ...Object.fromEntries(
        AMENITIES.map((a) => [
          `features.${a.key}`,
          defaultValues?.features?.[a.key] || false,
        ]),
      ),
      ...Object.fromEntries(
        EXTRA_FEATURES.map((e) => [
          `extraFeatures.${e.key}`,
          defaultValues?.features?.[e.key] || false,
        ]),
      ),
    },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const selectedType = watch("propertyType");
  const isRoomOrStudio = [
    "room",
    "room_modern",
    "room_furnished",
    "studio",
    "studio_simple",
    "studio_modern",
    "hotel_room",
  ].includes(selectedType);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Réinitialiser l'input pour permettre de sélectionner les mêmes fichiers
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      // Libérer l'URL objet
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleFormSubmit = (data: any) => {
    console.log("Données brutes reçues :", data);

    // Construction du payload structuré en utilisant directement les objets imbriqués
    const payload = {
      title: data.title,
      description: data.description,
      propertyType: data.propertyType,
      listing: {
        type: data.transactionType,
        price: { amount: Number(data.price), currency: data.currency },
        ...(data.transactionType === "rent" && {
          monthlyRent: { amount: Number(data.price), currency: data.currency },
        }),
      },
      address: {
        street: data.address?.street || "",
        city: data.address?.city || "",
        postalCode: data.address?.postalCode || "",
        country: data.address?.country || "",
        coordinates: selectedLocation
          ? {
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }
          : undefined,
        additionalInfo: selectedLocation?.address || undefined,
      },
      features: {
        rooms: Number(data.features?.rooms) || 1,
        bedrooms: Number(data.features?.bedrooms) || 1,
        bathrooms: Number(data.features?.bathrooms) || 1,
        livingArea: {
          value: Number(data.features?.livingArea) || 0,
          unit: data.features?.livingAreaUnit || "m²",
        },
        landArea: data.features?.landArea
          ? {
              value: Number(data.features?.landArea),
              unit: data.features?.landAreaUnit || "m²",
            }
          : undefined,
        floor:
          data.features?.floor !== undefined
            ? Number(data.features?.floor)
            : undefined,
        totalFloors:
          data.features?.totalFloors !== undefined
            ? Number(data.features?.totalFloors)
            : undefined,
        yearBuilt: data.features?.yearBuilt
          ? Number(data.features?.yearBuilt)
          : undefined,

        // --- CORRECTION ICI POUR S'ALIGNER SUR LE EnergyClassDto ---
        energyClass: data.features?.energyClass
          ? {
              letter: data.features.energyClass,
              consumption: 0, // On met 0 par défaut pour valider le @IsNumber() du DTO backend
            }
          : undefined,

        // Mappage dynamique des équipements standards et spécifiques
        ...Object.fromEntries(
          AMENITIES.map((a) => [a.key, !!data.features?.[a.key]]),
        ),
        ...Object.fromEntries(
          EXTRA_FEATURES.map((e) => [e.key, !!data.extraFeatures?.[e.key]]),
        ),
      },
      files: selectedFiles,
    };

    console.log("Payload propre envoyé au serveur :", payload);
    onSubmit(payload);
  };

  const handleFormSubmit2 = (data: any) => {
    // Construction du payload structuré

    const payload = {
      title: data.title,

      description: data.description,

      propertyType: data.propertyType,

      listing: {
        type: data.transactionType,

        price: { amount: data.price, currency: data.currency },

        ...(data.transactionType === "rent" && {
          monthlyRent: { amount: data.price, currency: data.currency },
        }),
      },

      address: {
        street: data["address.street"],

        city: data["address.city"],

        postalCode: data["address.postalCode"],

        country: data["address.country"],

        coordinates: selectedLocation
          ? {
              latitude: selectedLocation.latitude,

              longitude: selectedLocation.longitude,
            }
          : undefined,

        additionalInfo: selectedLocation?.address || undefined,
      },

      features: {
        rooms: data["features.rooms"],

        bedrooms: data["features.bedrooms"],

        bathrooms: data["features.bathrooms"],

        livingArea: {
          value: data["features.livingArea"],

          unit: data["features.livingAreaUnit"],
        },

        landArea: data["features.landArea"]
          ? {
              value: data["features.landArea"],

              unit: data["features.landAreaUnit"] || "m²",
            }
          : undefined,

        floor: data["features.floor"] || undefined,

        totalFloors: data["features.totalFloors"] || undefined,

        yearBuilt: data["features.yearBuilt"]
          ? Number(data["features.yearBuilt"])
          : undefined,

        energyClass: data["features.energyClass"] || undefined,

        ...Object.fromEntries(
          AMENITIES.map((a) => [a.key, !!data[`features.${a.key}`]]),
        ),

        ...Object.fromEntries(
          EXTRA_FEATURES.map((e) => [e.key, !!data[`extraFeatures.${e.key}`]]),
        ),
      },

      // Ajout des fichiers

      files: selectedFiles,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-8 max-w-4xl"
    >
      {/* Type de bien et transaction */}
      <Card>
        <h3 className="text-lg font-heading mb-4">
          Type de bien et transaction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              Transaction
            </label>
            <select
              {...register("transactionType")}
              className="w-full rounded-lg border border-primary-200 p-3"
            >
              <option value="sale">À vendre</option>
              <option value="rent">À louer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prix</label>
            <div className="flex gap-2">
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="flex-1 rounded-lg border border-primary-200 p-2"
                placeholder="Montant"
              />
              <select
                {...register("currency")}
                className="rounded-lg border border-primary-200 p-2 w-24"
              >
                <option value="XAF">FCFA</option>
                <option value="EUR">€</option>
                <option value="USD">$</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Informations générales */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Description</h3>
        <div className="space-y-4">
          <Input
            label="Titre de l'annonce"
            {...register("title", { required: true })}
          />
          <div>
            <label className="block text-sm font-medium mb-1">
              Description détaillée
            </label>
            <textarea
              {...register("description", { required: true })}
              rows={6}
              className="w-full rounded-lg border border-primary-200 p-3 focus:ring-2 focus:ring-accent"
              placeholder="Décrivez votre bien en détail..."
            />
          </div>
        </div>
      </Card>

      {/* Adresse */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Rue / Quartier" {...register("address.street")} />
          <Input
            label="Ville"
            {...register("address.city", { required: true })}
          />
          <Input label="Code postal" {...register("address.postalCode")} />
          <Input
            label="Pays"
            {...register("address.country", { required: true })}
          />
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-heading mb-4">Localisation sur la carte</h3>
        <PropertyMapSelector
          onLocationSelect={(location) => setSelectedLocation(location)}
        />
      </Card>

      {/* Photos */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Photos du bien</h3>
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-primary-200 rounded-xl p-6 text-center cursor-pointer hover:border-accent hover:bg-primary-50 transition-colors"
          >
            <PhotoIcon className="h-10 w-10 text-primary-300 mx-auto mb-2" />
            <p className="text-sm text-primary-500">
              Cliquez pour ajouter des photos (JPG, PNG, max 5 Mo)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Prévisualisations */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={preview}
                    alt={`Aperçu ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-accent text-white text-xs px-2 py-0.5 rounded">
                      Principale
                    </span>
                  )}
                </div>
              ))}
              {/* Bouton ajouter plus */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-primary-200 flex items-center justify-center hover:border-accent hover:bg-primary-50 transition-colors"
              >
                <PlusIcon className="h-8 w-8 text-primary-300" />
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Caractéristiques selon le type */}
      <Card>
        <h3 className="text-lg font-heading mb-4">Caractéristiques</h3>

        {/* Surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Surface habitable
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                {...register("features.livingArea", { valueAsNumber: true })}
                className="flex-1 rounded-lg border border-primary-200 p-2"
                placeholder="Valeur"
              />
              <select
                {...register("features.livingAreaUnit")}
                className="rounded-lg border border-primary-200 p-2 w-20"
              >
                <option value="m²">m²</option>
                <option value="ft²">ft²</option>
              </select>
            </div>
          </div>
          {!isRoomOrStudio && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Surface terrain (optionnel)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  {...register("features.landArea", { valueAsNumber: true })}
                  className="flex-1 rounded-lg border border-primary-200 p-2"
                  placeholder="Valeur"
                />
                <select
                  {...register("features.landAreaUnit")}
                  className="rounded-lg border border-primary-200 p-2 w-20"
                >
                  <option value="m²">m²</option>
                  <option value="ha">ha</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Pièces */}
        {selectedType !== "land" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {!isRoomOrStudio && (
              <Input
                label="Pièces"
                type="number"
                {...register("features.rooms", { valueAsNumber: true })}
              />
            )}
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
            <Input
              label="Étage"
              type="number"
              {...register("features.floor", { valueAsNumber: true })}
            />
            <Input
              label="Étages total"
              type="number"
              {...register("features.totalFloors", { valueAsNumber: true })}
            />
            <Input
              label="Année construction"
              type="number"
              {...register("features.yearBuilt")}
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Classe énergie
              </label>
              <select
                {...register("features.energyClass")}
                className="w-full rounded-lg border border-primary-200 p-2"
              >
                <option value="">--</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
          </div>
        )}

        {/* Équipements */}
        <div>
          <h4 className="font-medium text-primary-900 mb-3">Équipements</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AMENITIES.map((amenity) => (
              <label
                key={amenity.key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  {...register(`features.${amenity.key}`)}
                  className="rounded border-primary-300 text-accent focus:ring-accent"
                />
                <span className="text-sm text-primary-700">
                  {amenity.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Spécificités locales */}
        <div className="mt-6">
          <h4 className="font-medium text-primary-900 mb-3">
            Spécificités locales
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {EXTRA_FEATURES.map((feature) => (
              <label
                key={feature.key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  {...register(`extraFeatures.${feature.key}`)}
                  className="rounded border-primary-300 text-accent focus:ring-accent"
                />
                <span className="text-sm text-primary-700">
                  {feature.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : submitLabel}
      </Button>
    </form>
  );
};
