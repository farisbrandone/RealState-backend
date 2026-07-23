"use client";

import React, { useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/ui/components/Input/Input";
import { Button } from "@/shared/ui/components/Button/Button";
import { Card } from "@/shared/ui/components/Card/Card";
import {
  PROPERTY_TYPES,
  AMENITIES,
  EXTRA_FEATURES,
} from "@/shared/constants/property.constants";
import { suggestCurrency } from "@/shared/lib/currency/currency-by-country";
import { getMediaUrl } from "@/shared/lib/media/media-url";
import { LocationCascadeFields } from "@/features/property-management/components/LocationCascadeFields";
import { PropertyMapSelector } from "@/widgets/PropertyMapSelector/PropertyMapSelector";
import {
  PhotoIcon,
  XCircleIcon,
  PlusIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { PropertyFormValues } from "@/features/property-management/types";

interface PropertyFormProps {
  defaultValues?: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  submitLabel: string;
  existingMediaParent?: { id: string; url: string; isMain: boolean }[];
}

const STEPS = [
  { id: 1, label: "Type & prix" },
  { id: 2, label: "Description" },
  { id: 3, label: "Localisation" },
  { id: 4, label: "Caractéristiques" },
  { id: 5, label: "Photos" },
] as const;

export const PropertyForm: React.FC<PropertyFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  existingMediaParent,
}) => {
  const form = useForm<PropertyFormValues>({
    mode: "onBlur",
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      propertyType: defaultValues?.propertyType || "",
      transactionType: defaultValues?.listing?.type || "sale",
      price: defaultValues?.listing?.price?.amount || "",
      currency: defaultValues?.listing?.price?.currency || "XAF",

      address: {
        street: defaultValues?.address?.street || "",
        city: defaultValues?.address?.city || "",
        neighborhood: defaultValues?.address?.neighborhood || "",
        postalCode: defaultValues?.address?.postalCode || "",
        country: defaultValues?.address?.country || "",
      },

      features: {
        rooms: defaultValues?.features?.rooms || 1,
        bedrooms: defaultValues?.features?.bedrooms || 1,
        bathrooms: defaultValues?.features?.bathrooms || 1,
        livingArea: defaultValues?.features?.livingArea?.value || "",
        livingAreaUnit: defaultValues?.features?.livingArea?.unit || "m²",
        landArea: defaultValues?.features?.landArea?.value || "",
        landAreaUnit: defaultValues?.features?.landArea?.unit || "m²",
        floor: defaultValues?.features?.floor || 0,
        totalFloors: defaultValues?.features?.totalFloors || 0,
        yearBuilt: defaultValues?.features?.yearBuilt || "",
        energyClass: defaultValues?.features?.energyClass?.letter || "",
        ...Object.fromEntries(
          AMENITIES.map((a) => [
            a.key,
            defaultValues?.features?.[a.key] || false,
          ]),
        ),
      },
      extraFeatures: Object.fromEntries(
        EXTRA_FEATURES.map((e) => [
          e.key,
          defaultValues?.features?.[e.key] || false,
        ]),
      ),
      virtualTourUrl: defaultValues?.virtualTourUrl || "",
      floorPlanUrl: defaultValues?.floorPlanUrl || "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = form;

  const [step, setStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [mainNewFileIndex, setMainNewFileIndex] = useState(0);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(
    defaultValues?.address?.coordinates
      ? {
          latitude: defaultValues.address.coordinates.latitude,
          longitude: defaultValues.address.coordinates.longitude,
          address: defaultValues.address.additionalInfo || "",
        }
      : null,
  );
  const [cityCenter, setCityCenter] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationTouched, setLocationTouched] = useState(false);
  const [existingMedia, setExistingMedia] = useState<any[]>(
    existingMediaParent || [],
  );
  const [removedMediaIds, setRemovedMediaIds] = useState<string[]>([]);

  const selectedType = watch("propertyType");
  const selectedCountry = watch("address.country");
  const isRoomOrStudio = [
    "room",
    "room_modern",
    "room_furnished",
    "studio",
    "studio_simple",
    "studio_modern",
    "hotel_room",
  ].includes(selectedType);

  // Suggestion automatique de devise dès qu'un pays est choisi (l'agent peut la changer)
  const handleCountrySync = () => {
    if (selectedCountry) setValue("currency", suggestCurrency(selectedCountry));
  };

  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_SIZE_MB = 8;
  const MAX_PHOTOS = 15;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const errs: string[] = [];
    const validFiles: File[] = [];
    files.forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errs.push(
          `${file.name} : format non supporté (JPG, PNG, WEBP uniquement)`,
        );
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errs.push(`${file.name} : dépasse ${MAX_SIZE_MB} Mo`);
        return;
      }
      validFiles.push(file);
    });

    if (selectedFiles.length + validFiles.length > MAX_PHOTOS) {
      errs.push(`Maximum ${MAX_PHOTOS} photos par annonce`);
    }

    setFileErrors(errs);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, MAX_PHOTOS));
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, MAX_PHOTOS));
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index]);
      next.splice(index, 1);
      return next;
    });
    if (mainNewFileIndex === index) setMainNewFileIndex(0);
    else if (mainNewFileIndex > index) setMainNewFileIndex((i) => i - 1);
  };

  const removeExistingMedia = (mediaId: string) => {
    setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId));
    setRemovedMediaIds((prev) => [...prev, mediaId]);
  };

  // Champs requis par étape — pour valider avant de passer à la suivante
  const FIELDS_BY_STEP: Record<number, string[]> = {
    1: ["propertyType", "transactionType", "price"],
    2: ["title", "description"],
    3: ["address.country", "address.city"],
    4: [],
    5: [],
  };

  const goToStep = async (target: number) => {
    if (target > step) {
      const valid = await trigger(FIELDS_BY_STEP[step] as any);
      if (!valid) return;
      if (step === 3 && !selectedLocation) {
        setLocationTouched(true);
        return;
      }
    }
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = (data: any) => {
    // Garde-fou : le formulaire est un wizard à 5 étapes, mais rien
    // n'empêchait jusqu'ici la soumission native du <form> de passer même
    // en étant encore sur une étape intermédiaire (ex: touche Entrée dans un
    // champ) dès lors que la localisation (étape 3) était renseignée — la
    // publication pouvait alors se déclencher avant la dernière étape.
    if (step !== STEPS.length) {
      goToStep(STEPS.length);
      return;
    }

    if (!selectedLocation) {
      setLocationTouched(true);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      title: data.title,
      description: data.description,
      propertyType: data.propertyType,
      listing: {
        type: data.transactionType,
        price: { amount: Number(data.price) || 0, currency: data.currency },
        ...(data.transactionType === "rent" && {
          monthlyRent: {
            amount: Number(data.price) || 0,
            currency: data.currency,
          },
        }),
      },
      address: {
        street: data.address?.street || undefined,
        city: data.address?.city,
        neighborhood: data.address?.neighborhood || undefined,
        postalCode: data.address?.postalCode || undefined,
        country: data.address?.country,
        coordinates: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
        additionalInfo: selectedLocation.address || undefined,
      },
      features: {
        rooms: !isRoomOrStudio ? Number(data.features?.rooms) || 1 : 1,
        bedrooms: Number(data.features?.bedrooms) || 1,
        bathrooms: Number(data.features?.bathrooms) || 1,
        livingArea: {
          value: Number(data.features?.livingArea) || 0,
          unit: data.features?.livingAreaUnit || "m²",
        },
        landArea:
          !isRoomOrStudio && data.features?.landArea
            ? {
                value: Number(data.features?.landArea),
                unit: data.features?.landAreaUnit || "m²",
              }
            : undefined,
        floor: Number(data.features?.floor) || 0,
        totalFloors: Number(data.features?.totalFloors) || 0,
        yearBuilt: data.features?.yearBuilt
          ? Number(data.features?.yearBuilt)
          : undefined,
        energyClass: data.features?.energyClass
          ? { letter: data.features.energyClass, consumption: 0 }
          : undefined,
        ...Object.fromEntries(
          AMENITIES.map((a) => [a.key, !!data.features?.[a.key]]),
        ),
        ...Object.fromEntries(
          EXTRA_FEATURES.map((e) => [e.key, !!data.extraFeatures?.[e.key]]),
        ),
      },
      files: selectedFiles,
      mainFileIndex: mainNewFileIndex, // ⬅️ le back sait quelle photo marquer isMain
      removedMediaIds,
      virtualTourUrl: data.virtualTourUrl?.trim() || undefined,
      floorPlanUrl: data.floorPlanUrl?.trim() || undefined,
    };

    onSubmit(payload);
  };

  const progressPercent = ((step - 1) / (STEPS.length - 1)) * 100;

  // Garde-fou contre la soumission implicite du navigateur : sur une étape
  // qui n'a qu'un seul champ "bloquant" (ex: le prix à l'étape 1), Entrée
  // soumet le <form> nativement même sans bouton submit visible — c'est ce
  // qui provoquait une publication avant la dernière étape. On intercepte
  // Entrée partout sauf dans un textarea (où elle doit insérer une ligne).
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (
      e.key !== "Enter" ||
      e.defaultPrevented || // déjà géré par un champ enfant (ex: recherche de lieu à l'étape 3)
      (e.target as HTMLElement).tagName === "TEXTAREA"
    )
      return;
    e.preventDefault();
    if (step < STEPS.length) goToStep(step + 1);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      onKeyDown={handleFormKeyDown}
      className="max-w-4xl"
    >
      {/* Barre de progression façon "application pro" */}
      <div className="sticky top-0 z-10 -mx-4 mb-8 bg-background/95 px-4 pb-4 pt-2 backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goToStep(s.id)}
              className="flex flex-1 flex-col items-center gap-1.5 group"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  s.id < step
                    ? "bg-green-500 text-white"
                    : s.id === step
                      ? "bg-accent text-ink"
                      : "bg-primary-100 text-primary-400 group-hover:bg-primary-200"
                }`}
              >
                {s.id < step ? <CheckIcon className="h-4 w-4" /> : s.id}
              </span>
              <span
                className={`hidden text-xs sm:block ${
                  s.id === step
                    ? "font-medium text-primary-900"
                    : "text-primary-400"
                }`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary-100">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* ÉTAPE 1 — Type & prix */}
        {step === 1 && (
          <Card>
            <h3 className="mb-4 font-heading text-lg text-primary-900">
              Type de bien et transaction
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Type de bien
                </label>
                <select
                  {...register("propertyType", { required: true })}
                  className={`w-full rounded-lg border p-3 bg-surface ${
                    errors.propertyType
                      ? "border-red-300"
                      : "border-primary-200"
                  }`}
                >
                  <option value="">Sélectionner</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {errors.propertyType && (
                  <p className="mt-1 text-xs text-red-500">Champ requis</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Transaction
                </label>
                <select
                  {...register("transactionType")}
                  className="w-full rounded-lg border border-primary-200 p-3 bg-surface"
                >
                  <option value="sale">À vendre</option>
                  <option value="rent">À louer</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Prix
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    {...register("price", { required: true, min: 1 })}
                    className={`flex-1 rounded-lg border p-3 bg-surface ${
                      errors.price ? "border-red-300" : "border-primary-200"
                    }`}
                    placeholder="Montant"
                  />
                  <select
                    {...register("currency")}
                    className="w-24 rounded-lg border border-primary-200 p-3 bg-surface"
                  >
                    <option value="XAF">FCFA</option>
                    <option value="XOF">CFA (UEMOA)</option>
                    <option value="MAD">MAD</option>
                    <option value="DZD">DZD</option>
                    <option value="TND">TND</option>
                    <option value="CDF">CDF</option>
                    <option value="EUR">€</option>
                    <option value="USD">$</option>
                  </select>
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">
                    Prix requis (supérieur à 0)
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* ÉTAPE 2 — Description */}
        {step === 2 && (
          <Card>
            <h3 className="mb-4 font-heading text-lg text-primary-900">
              Description
            </h3>
            <div className="space-y-4">
              <Input
                label="Titre de l'annonce"
                placeholder="Ex: Superbe villa 4 chambres à Bonapriso"
                error={errors.title ? "Le titre est requis" : undefined}
                {...register("title", { required: true })}
              />
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium text-primary-700">
                    Description détaillée
                  </label>
                  <span className="text-xs text-primary-400">
                    {watch("description")?.length || 0} caractères
                  </span>
                </div>
                <textarea
                  {...register("description", {
                    required: true,
                    minLength: 30,
                  })}
                  rows={7}
                  className={`w-full rounded-lg border p-3 bg-surface focus:outline-none focus:ring-2 focus:ring-accent ${
                    errors.description ? "border-red-300" : "border-primary-200"
                  }`}
                  placeholder="Décrivez votre bien : atouts, environnement, accès, sécurité..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    Décrivez le bien en au moins 30 caractères
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* ÉTAPE 3 — Localisation */}
        {step === 3 && (
          <>
            <Card>
              <h3 className="mb-4 font-heading text-lg text-primary-900">
                Où se situe le bien ?
              </h3>
              <div onBlur={handleCountrySync}>
                <LocationCascadeFields
                  form={form}
                  onCityCenterChange={setCityCenter}
                />
              </div>
              <div className="mt-4">
                <Input
                  label="Rue / point de repère (optionnel)"
                  placeholder='Ex: "Face à la pharmacie du Rond-Point", "Rue 1234"'
                  {...register("address.street")}
                />
              </div>
              <div className="mt-4 max-w-xs">
                <Input
                  label="Code postal (optionnel)"
                  {...register("address.postalCode")}
                />
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-heading text-lg text-primary-900">
                Position exacte sur la carte
              </h3>
              <PropertyMapSelector
                cityCenter={cityCenter}
                hasError={locationTouched && !selectedLocation}
                // Position déjà connue en édition (voir l'init de
                // selectedLocation ci-dessus depuis defaultValues) : n'est lue
                // qu'au montage par PropertyMapSelector, donc reste correcte
                // même quand selectedLocation change ensuite.
                initialMarker={
                  selectedLocation
                    ? {
                        lat: selectedLocation.latitude,
                        lng: selectedLocation.longitude,
                      }
                    : null
                }
                initialAddress={selectedLocation?.address || null}
                onLocationSelect={(location) => {
                  setSelectedLocation(location);
                  if (location) setLocationTouched(false);
                }}
              />
              {locationTouched && !selectedLocation && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-500">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  Veuillez placer un repère sur la carte avant de continuer.
                </p>
              )}
            </Card>
          </>
        )}

        {/* ÉTAPE 4 — Caractéristiques */}
        {step === 4 && (
          <Card>
            <h3 className="mb-4 font-heading text-lg text-primary-900">
              Caractéristiques
            </h3>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Surface habitable
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    {...register("features.livingArea", {
                      required: true,
                      min: 1,
                    })}
                    className={`flex-1 rounded-lg border p-2 bg-surface ${
                      errors.features?.livingArea
                        ? "border-red-300"
                        : "border-primary-200"
                    }`}
                    placeholder="Valeur"
                  />
                  <select
                    {...register("features.livingAreaUnit")}
                    className="w-20 rounded-lg border border-primary-200 p-2 bg-surface"
                  >
                    <option value="m²">m²</option>
                    <option value="ft²">ft²</option>
                  </select>
                </div>
                {errors.features?.livingArea && (
                  <p className="mt-1 text-xs text-red-500">Surface requise</p>
                )}
              </div>

              {!isRoomOrStudio && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-primary-700">
                    Surface terrain (optionnel)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      {...register("features.landArea")}
                      className="flex-1 rounded-lg border border-primary-200 p-2 bg-surface"
                      placeholder="Valeur"
                    />
                    <select
                      {...register("features.landAreaUnit")}
                      className="w-20 rounded-lg border border-primary-200 p-2 bg-surface"
                    >
                      <option value="m²">m²</option>
                      <option value="ha">ha</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {selectedType !== "land" && (
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
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
                  {...register("features.yearBuilt", { valueAsNumber: true })}
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-primary-700">
                    Classe énergie
                  </label>
                  <select
                    {...register("features.energyClass")}
                    className="w-full rounded-lg border border-primary-200 p-2 bg-surface"
                  >
                    <option value="">--</option>
                    {["A", "B", "C", "D", "E", "F", "G"].map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="border-t border-primary-100 pt-4">
              <h4 className="mb-3 font-medium text-primary-900">Équipements</h4>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {AMENITIES.map((amenity) => (
                  <label
                    key={amenity.key}
                    className="flex cursor-pointer items-center gap-2"
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

            <div className="mt-6 border-t border-primary-100 pt-4">
              <h4 className="mb-3 font-medium text-primary-900">
                Spécificités locales
              </h4>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {EXTRA_FEATURES.map((feature) => (
                  <label
                    key={feature.key}
                    className="flex cursor-pointer items-center gap-2"
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
        )}

        {/* ÉTAPE 5 — Photos */}
        {step === 5 && (
          <Card>
            <h3 className="mb-4 font-heading text-lg text-primary-900">
              Photos du bien
            </h3>

            {existingMedia.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-3 font-medium text-primary-900">
                  Photos actuelles
                </h4>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {existingMedia.map((media, index) => (
                    <div
                      key={media.id}
                      className="group relative aspect-square overflow-hidden rounded-lg"
                    >
                      <img
                        src={getMediaUrl(media.url) ?? undefined}
                        alt={`Photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingMedia(media.id)}
                        className="absolute right-1 top-1 rounded-full bg-white/80 p-1 text-red-500 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                      {media.isMain && (
                        <span className="absolute bottom-1 left-1 rounded bg-accent px-2 py-0.5 text-xs text-ink">
                          Principale
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-primary-200 p-6 text-center transition-colors hover:border-accent hover:bg-primary-50"
              >
                <PhotoIcon className="mx-auto mb-2 h-10 w-10 text-primary-300" />
                <p className="text-sm text-primary-500">
                  JPG, PNG, WEBP — 8 Mo max, 15 photos max
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {fileErrors.length > 0 && (
                <div className="space-y-1 rounded-lg bg-red-50 p-3">
                  {fileErrors.map((err, i) => (
                    <p key={i} className="text-xs text-red-600">
                      {err}
                    </p>
                  ))}
                </div>
              )}

              {previews.length > 0 && (
                <>
                  <p className="text-xs text-primary-400">
                    Cliquez sur l'étoile pour définir la photo principale de
                    l'annonce.
                  </p>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {previews.map((preview, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square overflow-hidden rounded-lg ring-2 ring-transparent has-[button:focus]:ring-accent"
                      >
                        <img
                          src={preview}
                          alt={`Aperçu ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute right-1 top-1 rounded-full bg-white/80 p-1 text-red-500 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMainNewFileIndex(index)}
                          className="absolute bottom-1 left-1 rounded-full bg-white/80 p-1 backdrop-blur-sm transition-opacity"
                          title="Définir comme photo principale"
                        >
                          {mainNewFileIndex === index ? (
                            <StarSolid className="h-4 w-4 text-accent" />
                          ) : (
                            <StarIcon className="h-4 w-4 text-primary-400 opacity-0 group-hover:opacity-100" />
                          )}
                        </button>
                        {mainNewFileIndex === index && (
                          <span className="absolute bottom-1 right-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-ink">
                            Principale
                          </span>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-primary-200 transition-colors hover:border-accent hover:bg-primary-50"
                    >
                      <PlusIcon className="h-8 w-8 text-primary-300" />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 border-t border-primary-100 pt-6">
              <h4 className="mb-3 font-medium text-primary-900">
                Visite virtuelle et plan (facultatif)
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-primary-600">
                    Lien de visite virtuelle
                  </label>
                  <input
                    type="url"
                    placeholder="https://my.matterport.com/show/?m=..."
                    {...register("virtualTourUrl")}
                    className="w-full rounded-lg border border-primary-200 p-3"
                  />
                  <p className="mt-1 text-xs text-primary-400">
                    Lien Matterport, Kuula, YouTube 360°… doit autoriser
                    l'intégration (iframe).
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-primary-600">
                    Lien de l'image du plan
                  </label>
                  <input
                    type="url"
                    placeholder="https://.../plan.jpg"
                    {...register("floorPlanUrl")}
                    className="w-full rounded-lg border border-primary-200 p-3"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Barre de navigation sticky en bas — comportement d'app pro */}
      <div className="sticky bottom-0 -mx-4 mt-8 flex items-center justify-between border-t border-primary-100 bg-background/95 px-4 py-4 backdrop-blur-sm">
        <Button
          type="button"
          variant="outline"
          onClick={() => goToStep(step - 1)}
          disabled={step === 1}
          className={step === 1 ? "invisible" : ""}
        >
          <ChevronLeftIcon className="mr-1 h-4 w-4" />
          Précédent
        </Button>
        {step < STEPS.length && (
          <Button
            type="button"
            variant="primary"
            onClick={() => goToStep(step + 1)}
          >
            Suivant
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </Button>
        )}{" "}
        {step === STEPS.length && (
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting && step === STEPS.length
              ? "Enregistrement..."
              : submitLabel}
          </Button>
        )}
      </div>
    </form>
  );
};
