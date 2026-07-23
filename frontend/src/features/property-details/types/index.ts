export interface PropertyDetail {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  propertyType: string;
  address: {
    street: string;
    city: string;
    neighborhood?: string; // ⬅️ ajouté — cohérent avec le reste de la plateforme
    postalCode: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    additionalInfo?: string;
  };
  features: {
    livingArea: { value: number; unit: string };
    landArea?: { value: number; unit: string };
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    floor?: number;
    totalFloors?: number;
    yearBuilt?: number;
    energyClass?: { letter: string; consumption: number };
    hasElevator: boolean;
    hasBalcony: boolean;
    hasTerrace: boolean;
    hasParking: boolean;
    hasGarden: boolean;
    hasPool: boolean;
    hasCellar: boolean;
    hasAirConditioning: boolean;
    hasAlarm: boolean;
    hasIntercom: boolean;
    isFurnished: boolean;
    // Équipements supplémentaires
    hasVeranda?: boolean;
    hasLivingRoom?: boolean;
    hasKitchen?: boolean;
    hasShower?: boolean;
    hasBathroom?: boolean;
    // Spécificités locales
    hasWaterTank?: boolean;
    hasGenerator?: boolean;
    hasSolarPanels?: boolean;
    hasSecurity?: boolean;
    hasFence?: boolean;
    hasBorehole?: boolean;
    hasGarage?: boolean;
  };
  listing: {
    type: "sale" | "rent";
    price: { amount: number; currency: string };
    monthlyRent?: { amount: number; currency: string };
    charges?: { amount: number; currency: string };
    availabilityDate?: string;
  };
  status: string;
  media: {
    id: string;
    url: string;
    type: "image" | "video";
    isMain: boolean;
    order: number;
    createdAt: string;
  }[];
  virtualTourUrl?: string | null;
  floorPlanUrl?: string | null;
  viewCount?: number;
  inquiryCount?: number;
  chatSettings?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  agent?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    phone?: string | null;
    email?: string;
    company?: string | null;
    averageRating?: number | null;
    propertiesListed?: number;
  } | null;
}
