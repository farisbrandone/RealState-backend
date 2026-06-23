export interface PropertyDetail {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  propertyType: string; // ⚠️ Ajouté
  address: {
    street: string;
    city: string;
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
  floorPlans?: any[];
  chatSettings?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  agent?: any;
}
