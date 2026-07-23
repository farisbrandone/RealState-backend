// Type de valeurs pour le formulaire de création/édition de bien.
// `features` réutilise directement la forme métier de PropertyDetail — une seule
// source de vérité pour les équipements, plus de duplication entre formulaire et API.

import { PropertyDetail } from "@/features/property-details/types";

export interface PropertyFormAddress {
  street: string;
  city: string;
  neighborhood: string;
  postalCode: string;
  country: string;
}

// Le formulaire manipule livingArea/landArea comme des nombres bruts (value) +
// une unité séparée (livingAreaUnit/landAreaUnit), alors que PropertyDetail les
// regroupe en objet { value, unit }. On part donc de PropertyDetail['features'],
// on retire les deux clés à la forme différente, puis on les redéclare à plat.
export type PropertyFormFeatures = Omit<
  PropertyDetail["features"],
  "livingArea" | "landArea" | "energyClass"
> & {
  livingArea: number;
  livingAreaUnit: "m²" | "ft²";
  landArea: number;
  landAreaUnit: "m²" | "ha";
  energyClass: string; // à plat dans le formulaire (juste la lettre), reconstruit en objet à la soumission
  [key: string]: any; // clés dynamiques additionnelles (AMENITIES / futurs équipements)
};

export interface PropertyFormValues {
  title: string;
  description: string;
  propertyType: string;
  transactionType: PropertyDetail["listing"]["type"];
  price: number;
  currency: string;

  address: PropertyFormAddress;
  features: PropertyFormFeatures;
  media?: File[];
  // Spécificités locales (clés dynamiques issues de EXTRA_FEATURES)
  extraFeatures: Record<string, boolean>;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
}
