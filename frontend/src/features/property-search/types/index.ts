export interface PropertySearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: string; // ⚠️ Ajouté
  location: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    geoPoint: {
      latitude: number;
      longitude: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    squareMeters: number;
    hasGarden: boolean;
    hasPool: boolean;
    hasGarage: boolean;
    hasTerrace: boolean;
    floor?: number;
    totalFloors?: number;
    constructionYear?: number;
    energyClass?: string;
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
  };
  images: string[];
  ownerId: string;
  status: string;
  transactionType: "sale" | "rent";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface SearchFilters {
  propertyType?: string[];
  transactionType?: "sale" | "rent";
  priceRange?: { min?: number; max?: number; currency?: string };
  location?: {
    city?: string;
    country?: string; // ⬅️ ajouté
    postalCode?: string; // optionnel
    address?: string; // optionnel
    geoPoint?: { latitude: number; longitude: number };
  };
  radius?: number;
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    squareMeters?: { min?: number; max?: number }; // ⬅️ changement : objet avec min/max
    hasGarden?: boolean;
    hasPool?: boolean;
    hasGarage?: boolean;
    hasTerrace?: boolean;
    hasElevator?: boolean;
    hasParking?: boolean;
    hasCellar?: boolean;
    hasAirConditioning?: boolean;
    hasAlarm?: boolean;
    hasIntercom?: boolean;
    isFurnished?: boolean;
    hasVeranda?: boolean;
    hasLivingRoom?: boolean;
    hasKitchen?: boolean;
    hasShower?: boolean;
    hasBathroom?: boolean;
    hasWaterTank?: boolean;
    hasGenerator?: boolean;
    hasSolarPanels?: boolean;
    hasSecurity?: boolean;
    hasFence?: boolean;
    hasBorehole?: boolean;
    constructionYear?: number;
    energyClass?: string;
    floor?: number;
    totalFloors?: number;
    // possibilité d'ajouter d'autres filtres
  };
  availability?: string;
  furnished?: boolean;
  petsAllowed?: boolean;
  listedSince?: string;
  sortBy?: string; // ⬅️ ajouté
  sortOrder?: "asc" | "desc"; // ⬅️ ajouté
}

export interface SearchResponse {
  items: PropertySearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  aggregations?: {
    avgPrice: number;
    propertyTypesCount: Record<string, number>;
  };
}
